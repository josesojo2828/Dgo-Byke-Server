import { Injectable, ForbiddenException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RaceRepository } from '../repository/race.repository';
import { CreateRaceDto, UpdateRaceDto } from '../interface/race.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';
import { User } from 'src/shared/types/system.type';
import { PrismaService } from 'src/shared/service/prisma.service'; // <--- NUEVO

@Injectable()
export class RaceService {
  constructor(
    private readonly repository: RaceRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly prisma: PrismaService // <--- Inyección necesaria para buscar orgs
  ) { }

  async getFormDataForCreate(userId: string) {
    const [tracks, organizations, categories] = await Promise.all([
      // 1. Tracks disponibles (públicos o del sistema)
      this.prisma.track.findMany({
        where: { deletedAt: null },
        select: { id: true, name: true, distanceKm: true }
      }),

      // 2. Solo las organizaciones donde el usuario actual es MIEMBRO
      this.prisma.organization.findMany({
        where: {
          members: { some: { userId } },
          deletedAt: null
        },
        select: { id: true, name: true }
      }),

      // 3. Todas las categorías para habilitar en la carrera
      this.prisma.category.findMany({
        where: { deletedAt: null },
        select: { id: true, name: true }
      })
    ]);

    return { tracks, organizations, categories };
  }

  async getDashboardStats() {
    const metrics = await this.repository.getDashboardMetrics();
    return metrics;
  }

  // ============================================================
  // CREAR CARRERA (Con lógica de Organización Automática)
  // ============================================================
  async create(createDto: CreateRaceDto, userSession: User) {
    // 1. Extraemos datos clave
    // Sacamos categoryIds y organizationId del objeto principal
    const { categoryIds, organizationId, ...restDto } = createDto;

    let targetOrgId = organizationId;

    // 2. Lógica de Asignación de Organización
    // Si no viene organizationId (es un Organizador creando su carrera), lo buscamos.
    if (!targetOrgId) {
      const membership = await this.prisma.organizationMember.findFirst({
        where: {
          userId: userSession.id,
          role: { in: ['OWNER', 'ADMIN'] } // Debe ser dueño o admin de la org
        }
      });

      if (!membership) {
        throw new ForbiddenException('No tienes una organización asociada para crear carreras.');
      }
      targetOrgId = membership.organizationId;
    }

    // 3. Preparamos el payload final
    const dataToCreate: any = {
      ...restDto,
      organizationId: targetOrgId, // <--- ID resuelto
      creatorId: userSession.id,
      status: 'BORRADOR',
      date: new Date(createDto.date),
    };

    // 4. Preparamos el input para Prisma (incluyendo conexión de categorías)
    const prismaCreateInput: any = {
      ...dataToCreate,
    };

    if (categoryIds && categoryIds.length > 0) {
      prismaCreateInput.categories = {
        connect: categoryIds.map(id => ({ id }))
      };
    }

    // 5. Llamada al Repo
    const result = await this.repository.createWithRelations(prismaCreateInput);

    // 6. Post-Event
    this.eventEmitter.emit('race:post:create', new DomainEvent({
      entityName: 'Race', action: 'post:create', payload: result
    }));

    return result;
  }

  // ============================================================
  // BUSCAR MIS CARRERAS (Nuevo método para Organizadores)
  // ============================================================
  async findAllByOwner(userId: string) {
    // 1. Buscar la organización del usuario
    const membership = await this.prisma.organizationMember.findFirst({
      where: {
        userId: userId,
        role: { in: ['OWNER', 'ADMIN'] }
      }
    });

    if (!membership) return []; // Si no tiene org, retorna lista vacía

    // 2. Reusar el repositorio filtrando por esa organización
    return this.repository.findAll({
      where: { organizationId: membership.organizationId },
      orderBy: { date: 'desc' }
    });
  }

  // ============================================================
  // MÉTODOS ESTÁNDAR (Sin cambios funcionales)
  // ============================================================

  async findAll(params?: any) {
    return this.repository.findAll(params);
  }

  async findOne(id: string) {
    return this.repository.findOne(id);
  }

  async update(id: string, updateDto: UpdateRaceDto) {
    this.eventEmitter.emit(
      'race:pre:update',
      new DomainEvent({ entityName: 'Race', action: 'pre:update', payload: { id, ...updateDto } }),
    );

    const result = await this.repository.update(id, updateDto);

    this.eventEmitter.emit(
      'race:post:update',
      new DomainEvent({ entityName: 'Race', action: 'post:update', payload: result }),
    );

    return result;
  }

  async remove(id: string) {
    this.eventEmitter.emit(
      'race:pre:delete',
      new DomainEvent({ entityName: 'Race', action: 'pre:delete', payload: { id } }),
    );

    const result = await this.repository.remove(id);

    this.eventEmitter.emit(
      'race:post:delete',
      new DomainEvent({ entityName: 'Race', action: 'post:delete', payload: result }),
    );

    return result;
  }
}