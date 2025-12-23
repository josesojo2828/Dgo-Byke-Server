import { ConflictException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto, TUserCreate, TUserWhere, UpdateUserDto } from '../interface/user.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';
import { startOfMonth, subMonths, format, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/shared/service/prisma.service';
import { AuditAction, SystemRole } from 'src/shared/types/system.type';
import { BusinessLogicException, EntityNotFoundException } from 'src/shared/error';

@Injectable()
export class UserService {

  constructor(
    private readonly repository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
    private prisma: PrismaService
  ) { }

  async getMyOrganizationDetail(userId: string) {
    const membership = await this.prisma.organizationMember.findFirst({
      where: { userId, deletedAt: null },
      include: {
        organization: {
          include: {
            _count: { select: { races: true, members: true, tracks: true } },
            races: { take: 5, orderBy: { date: 'desc' } } // Últimas carreras
          }
        }
      }
    });

    if (!membership) throw new EntityNotFoundException('No perteneces a ninguna organización');
    return membership.organization;
  }

  async createOrganization(userId: string, data: { name: string, slug: string, description?: string }) {
    // 1. Verificamos que el slug no esté tomado
    const existing = await this.prisma.organization.findUnique({
      where: { slug: data.slug }
    });

    if (existing) {
      throw new BusinessLogicException('El identificador (slug) ya está en uso por otra organización');
    }

    // 2. Transacción atómica: Crear Org y asignar Miembro
    return this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          members: {
            create: {
              userId: userId,
              role: 'OWNER',
              position: 'Fundador'
            }
          }
        }
      });

      return org;
    });
  }

  async getMyOrganizationStatus(userId: string) {
    // Buscamos si el usuario tiene una membresía con rol OWNER o ADMIN
    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        userId,
        role: { in: ['OWNER', 'ADMIN'] },
        deletedAt: null
      },
      include: {
        organization: {
          include: {
            _count: {
              select: { races: true, members: true }
            }
          }
        }
      }
    });

    if (!membership) return { hasOrg: false };

    return {
      hasOrg: true,
      role: membership.role,
      organization: {
        id: membership.organization.id,
        name: membership.organization.name,
        slug: membership.organization.slug,
        logoUrl: membership.organization.logoUrl,
        stats: {
          racesCount: membership.organization._count.races,
          membersCount: membership.organization._count.members
        }
      }
    };
  }
  async getCyclistResults(userId: string) {
    // 1. Obtener el perfil para tener el profileId
    const profile = await this.prisma.cyclistProfile.findUnique({
      where: { userId },
    });

    if (!profile) throw new EntityNotFoundException('Perfil no encontrado');

    // 2. Buscar participaciones con datos de carrera y pista (para la distancia)
    const participations = await this.prisma.raceParticipant.findMany({
      where: {
        profileId: profile.id,
        race: { date: { lte: new Date() } } // Carreras pasadas
      },
      include: {
        race: {
          include: { track: true }
        }
      },
      orderBy: { race: { date: 'desc' } }
    });

    // 3. Cálculos de métricas (Usando los nombres correctos de tu Prisma)
    const totalRaces = participations.length;
    // En tu schema es "rank", no "finalPosition"
    const podiums = participations.filter(p => p.rank !== null && p.rank <= 3).length;
    // La distancia está en p.race.track.distanceKm
    const totalKm = participations.reduce((acc, p) => acc + (p.race.track?.distanceKm || 0), 0);

    // Cálculo de posición media
    const rankedRaces = participations.filter(p => p.rank !== null);
    const averagePosition = rankedRaces.length > 0
      ? (rankedRaces.reduce((acc, p) => acc + (p.rank || 0), 0) / rankedRaces.length).toFixed(1)
      : "0";

    // 4. Mapeo para el gráfico de Recharts
    const chartData = [...participations]
      .reverse() // De más antigua a más reciente para el gráfico
      .filter(p => p.rank !== null)
      .map(p => ({
        race: p.race.name.substring(0, 10) + '...',
        position: p.rank,
        date: p.race.date
      }));

    return {
      summary: {
        totalRaces,
        podiums,
        totalKm: totalKm.toFixed(1),
        averagePosition
      },
      // Ajustamos los nombres de los campos para que el front no rompa
      history: participations.map(p => ({
        id: p.id,
        raceName: p.race.name,
        date: p.race.date,
        type: p.race.type,
        rank: p.rank, // Cambiado de finalPosition a rank
        time: p.finalTime ? this.formatTime(p.finalTime) : '--:--:--', // Cambiado de totalTime a finalTime
      })),
      chartData
    };
  }

  async getFullProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        cyclistProfile: true,
      },
    });
  }

  async updateFullProfile(userId: string, data: any) {
    const { fullName, phone, avatarUrl, ...profileData } = data;

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        phone,
        avatarUrl,
        cyclistProfile: {
          update: {
            // Conversión explícita a número para evitar error de Prisma
            weight: profileData.weight ? Number(profileData.weight) : null,
            height: profileData.height ? Number(profileData.height) : null,
            bloodType: profileData.bloodType,
            jerseySize: profileData.jerseySize,
            emergencyContactName: profileData.emergencyContactName,
            emergencyContactPhone: profileData.emergencyContactPhone,
            teamName: profileData.teamName,
          },
        },
      },
    });
  }

  // Endpoint para el Garaje del Ciclista (Soluciona el error 403)
  async getMyGarage(userId: string) {
    const profile = await this.prisma.cyclistProfile.findUnique({
      where: { userId },
      include: {
        bicycles: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    return profile?.bicycles || [];
  }

  async createMyBike(userId: string, data: any) {
    const profile = await this.prisma.cyclistProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      throw new BusinessLogicException('Debes completar tu perfil de ciclista primero');
    }

    return this.prisma.bicycle.create({
      data: {
        brand: data.brand,
        model: data.model,
        type: data.type,
        color: data.color,
        serialNumber: data.serialNumber,
        cyclistProfileId: profile.id, // Vinculación automática al perfil del solicitante
        isActive: true
      }
    });
  }

  async getCyclistDashboard(userId: string) {
    // 1. Buscamos el perfil del ciclista y su información de usuario
    const profile = await this.prisma.cyclistProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { fullName: true, avatarUrl: true } },
        bicycles: { where: { isActive: true } },
        _count: {
          select: { participations: true, bicycles: true }
        }
      }
    });

    if (!profile) throw new EntityNotFoundException('Cyclist profile not found');

    // 2. Ejecutamos consultas paralelas para alimentar la UI
    const [upcomingRaces, recentResults] = await Promise.all([
      // Próximas carreras (Suscrito pero fecha futura)
      this.prisma.raceParticipant.findMany({
        where: {
          profileId: profile.id,
          race: { date: { gte: new Date() } }
        },
        include: {
          race: { include: { track: true, organization: true } }
        },
        take: 3,
        orderBy: { race: { date: 'asc' } }
      }),

      // Resultados recientes (Carreras pasadas con tiempo final)
      this.prisma.raceParticipant.findMany({
        where: {
          profileId: profile.id,
          race: { date: { lt: new Date() } },
          finalTime: { not: null }
        },
        include: { race: true },
        take: 3,
        orderBy: { race: { date: 'desc' } }
      })
    ]);

    // 3. Formateamos la respuesta para la UI
    return {
      user: {
        fullName: profile.user.fullName,
        firstName: profile.user.fullName.split(' ')[0],
        avatar: profile.user.avatarUrl
      },
      // Eliminamos Wallet, usamos Bicycles y Participations totales
      stats: {
        totalRaces: profile._count.participations,
        activeBikes: profile._count.bicycles,
        upcomingCount: upcomingRaces.length,
      },
      // Calendario de próximas carreras
      schedule: upcomingRaces.map(p => ({
        id: p.id,
        raceName: p.race.name,
        date: p.race.date,
        distance: `${p.race.track.distanceKm}km`,
        org: p.race.organization.name,
        status: p.hasPaid ? 'Confirmed' : 'Payment Pending'
      })),
      // Historial de resultados
      results: recentResults.map(r => ({
        raceName: r.race.name,
        time: r.finalTime ? this.formatSeconds(r.finalTime) : 'Pendiente',
        position: r.rank ? `${r.rank}º` : 'N/A',
        bib: r.bibNumber
      }))
    };
  }

  private formatSeconds(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  private formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  private formatRank(rank: number): string {
    if (rank === 1) return '1st';
    if (rank === 2) return '2nd';
    if (rank === 3) return '3rd';
    return `${rank}th`;
  }

  async getMyTickets(userId: string) {
    // 1. Primero obtenemos el perfil del ciclista
    const profile = await this.prisma.cyclistProfile.findUnique({
      where: { userId },
    });

    if (!profile) return [];

    // 2. Buscamos sus participaciones en carreras
    return this.prisma.raceParticipant.findMany({
      where: {
        profileId: profile.id,
        deletedAt: null
      },
      include: {
        race: {
          include: {
            track: {
              select: {
                name: true,
                distanceKm: true,
                latitude: true,
                longitude: true,
                geoData: true,
                // locationName: true, // Si lo agregaste al modelo
              }
            },
            organization: {
              select: {
                name: true,
                logoUrl: true
              }
            }
          }
        },
        bicycle: {
          select: {
            brand: true,
            model: true
          }
        }
      },
      orderBy: {
        race: {
          date: 'desc'
        }
      }
    });
  }

  async create(createDto: CreateUserDto) {
    // Hash password if present
    if (createDto.password) {
      const salt = await bcrypt.genSalt();
      createDto.password = await bcrypt.hash(createDto.password, salt);
    }

    // 1. Pre-Event
    this.eventEmitter.emit(
      'user:pre:create',
      new DomainEvent({
        entityName: 'User',
        action: 'pre:create',
        payload: createDto,
      }),
    );

    const existingUser = await this.repository.findByEmail(createDto.email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const { roleId } = createDto;

    const rolFound = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!rolFound) throw new BusinessLogicException('No existe el rol seleccionado');

    const objectCreate: TUserCreate = {
      email: createDto.email,
      password: createDto.password,
      fullName: createDto.fullName,
      isActive: true,
      phone: createDto.phone,
      roles: { create: { roleId: rolFound.id } },
      cyclistProfile: { create: {} }
    };

    const result = await this.repository.create(objectCreate);

    if (rolFound.name === SystemRole.ORGANIZER) {
      await this.prisma.organization.create({
        data: {
          name: `Org - ${result.fullName}`, // Dinámico
          slug: `org-${result.id.split('-')[0]}`, // Slug único temporal
          description: 'Organización creada automáticamente',
          members: {
            create: {
              userId: result.id,
              role: 'OWNER' // Cambiado de ADMIN a OWNER para coherencia con tu enum OrgRole
            }
          }
        }
      })
    }

    // await this.repository.createWithRole(objectCreate, createDto.roleId);

    // 3. Post-Event
    this.eventEmitter.emit(
      'user:post:create',
      new DomainEvent({
        entityName: 'User',
        action: 'post:create',
        payload: result,
      }),
    );

    return result;
  }

  async findAll(params?: { search?: string; role?: string }) {
    const { search, role } = params || {};

    // 1. Filtro Base: No eliminados
    const where: TUserWhere = {
      deletedAt: null,
    };

    // 2. Búsqueda de Texto (Nombre o Email)
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 3. Filtro por Rol (Relacional)
    // "Busca usuarios donde ALGUNO (some) de sus roles tenga un nombre que coincida"
    if (role && role !== 'ALL') {
      // Normalizamos: Frontend manda 'SUPER_ADMIN', DB tiene 'Super Admin' o 'SUPER_ADMIN'
      // Usamos contains/insensitive para ser flexibles
      const roleName = role.replace('_', ' ');

      where.roles = {
        some: {
          role: {
            name: { contains: roleName, mode: 'insensitive' }
          }
        }
      };
    }

    // 4. Llamada al Repositorio
    return this.repository.findAll({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    return this.repository.findOne(id);
  }

  async findByToken(tk: string) {
    return this.repository.findToken(tk);
  }

  async update(id: string, updateDto: UpdateUserDto) {
    // Hash password if present
    if (updateDto.password) {
      const salt = await bcrypt.genSalt();
      updateDto.password = await bcrypt.hash(updateDto.password, salt);
    }

    // 1. Pre-Event
    this.eventEmitter.emit(
      'user:pre:update',
      new DomainEvent({
        entityName: 'User',
        action: 'pre:update',
        payload: { id, ...updateDto },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.update(id, updateDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'user:post:update',
      new DomainEvent({
        entityName: 'User',
        action: 'post:update',
        payload: result,
      }),
    );

    return result;
  }

  async remove(id: string) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'user:pre:delete',
      new DomainEvent({
        entityName: 'User',
        action: 'pre:delete',
        payload: { id },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.remove(id);

    // 3. Post-Event
    this.eventEmitter.emit(
      'user:post:delete',
      new DomainEvent({
        entityName: 'User',
        action: 'post:delete',
        payload: result,
      }),
    );

    return result;
  }

  async findByEmail(email: string) {
    return await this.repository.findByEmail(email);
  }

  async findWithPermissions(id: string) {
    return this.repository.findWithPermissions(id);
  }

  async setToken(id: string, token: string) {
    return this.repository.update(id, { token });
  }

  extractPermissions = (user: any): string[] => {
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      return [];
    }

    // Usamos un Set para evitar duplicados si dos roles tienen el mismo permiso
    const permissionsSet = new Set<string>();

    // 1. Recorremos los roles asignados al usuario
    user.roles.forEach((userRole: any) => {

      // Validamos que el rol y sus permisos existan
      if (userRole.role && Array.isArray(userRole.role.permissions)) {

        // 2. Recorremos los permisos dentro de ese rol
        userRole.role.permissions.forEach((rolePermission: any) => {

          // 3. Accedemos al objeto 'permission' y luego a la 'action'
          if (rolePermission.permission && rolePermission.permission.action) {
            permissionsSet.add(rolePermission.permission.action);
          }
        });
      }
    });

    // Convertimos el Set de vuelta a un Array
    return Array.from(permissionsSet);
  };

  // ------------------------------------------------
  // NUEVO: Métodos para el Dashboard
  // ------------------------------------------------

  async getDashboardStats() {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const sixMonthsAgo = subMonths(startOfMonth(now), 5);

    const [
      totalUsers,
      activeUsers,
      blockedUsers,
      newUsersCurrentMonth,
      newUsersLastMonth,
      recentLogs,
      lastSemesterUsers // <--- Asumiendo que esto devuelve un array de usuarios
    ] = await Promise.all([
      this.repository.count(), // Total
      this.repository.count({ isActive: true }), // Activos
      this.repository.count({ isActive: false }), // Bloqueados
      this.repository.count({ createdAt: { gte: currentMonthStart } }), // Nuevos este mes
      this.repository.count({ // Nuevos mes anterior
        createdAt: {
          gte: lastMonthStart,
          lt: currentMonthStart
        }
      }),
      // Logs recientes
      this.prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { fullName: true, email: true, avatarUrl: true } } },
        where: {
          action: { in: [AuditAction.LOGIN, AuditAction.UPDATE, AuditAction.CREATE] }
        }
      }),
      // Usuarios últimos 6 meses (para el gráfico)
      // Nota: Si tu repository.findAll devuelve paginación ({data, meta}), usa this.prisma.user.findMany aquí mejor.
      this.repository.findAll({
        where: { createdAt: { gte: sixMonthsAgo } },
      })
    ]);

    // Lógica del Gráfico
    const chartData: { name: string; usuarios: number }[] = [];

    for (let i = 0; i < 6; i++) {
      const dateRef = subMonths(now, i);
      const monthKey = format(dateRef, 'yyyy-MM'); // Ej: "2023-12"
      const monthLabel = format(dateRef, 'MMM', { locale: es }); // Ej: "dic"

      // Aquí definimos 'count' filtrando el array que trajimos arriba
      // (Asegúrate de que lastSemesterUsers sea un array. Si es un objeto paginado, usa lastSemesterUsers.data)
      const usersInMonth = (lastSemesterUsers as any[]).filter(u =>
        format(new Date(u.createdAt), 'yyyy-MM') === monthKey
      );

      const count = usersInMonth.length;

      chartData.unshift({
        name: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
        usuarios: count,
      });
    }

    // Calcular tendencias
    const newUsersTrend = newUsersLastMonth === 0
      ? 100
      : Math.round(((newUsersCurrentMonth - newUsersLastMonth) / newUsersLastMonth) * 100);

    return {
      stats: {
        total: totalUsers,
        active: activeUsers,
        blocked: blockedUsers,
        newMonth: newUsersCurrentMonth,
        trend: newUsersTrend
      },
      recentActivity: recentLogs,
      chartData: chartData // <--- Importante devolver esto
    };
  }
}

