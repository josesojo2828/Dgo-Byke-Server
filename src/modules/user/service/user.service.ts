import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto, TUserCreate, UpdateUserDto } from '../interface/user.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';
import { startOfMonth, subMonths, format, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/shared/service/prisma.service';
import { AuditAction, SystemRole } from 'src/shared/types/system.type';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
    private prisma: PrismaService
  ) { }

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

    const objectCreate: TUserCreate = {
      email: createDto.email,
      password: createDto.password,
      fullName: createDto.fullName,
      isActive: true,
      systemRole: createDto.systemRole,
      phone: createDto.phone,
    };

    if (objectCreate.systemRole === SystemRole.CYCLIST) {
      objectCreate.cyclistProfile = { create: {} }
    }

    // 2. Repository Logic
    const result = await this.repository.create(objectCreate);

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

  async findAll(params?: any) {
    // Basic FindAll - can be extended with events if needed (e.g. audit read)
    return this.repository.findAll(params);
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
    return this.repository.findByEmail(email);
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

