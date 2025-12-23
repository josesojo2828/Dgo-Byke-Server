import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RaceRepository } from '../repository/race.repository';
import { CreateRaceDto, UpdateRaceDto } from '../interface/race.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';
import { User } from 'src/shared/types/system.type';

@Injectable()
export class RaceService {
  constructor(
    private readonly repository: RaceRepository,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async getDashboardStats() {
    const metrics = await this.repository.getDashboardMetrics();
    return metrics;
  }

  async create(createDto: CreateRaceDto, userSession: User) {
    // 1. Extraemos categoryIds para manejarlos aparte
    const { categoryIds, ...restDto } = createDto;

    // 2. Preparamos el payload con el creatorId
    const dataToCreate: any = {
      ...restDto,
      creatorId: userSession.id, // <--- ASIGNACIÓN AUTOMÁTICA
      status: 'BORRADOR', // Default status
      date: new Date(createDto.date), // Asegurar formato fecha
    };

    // 3. Repository Logic (pasamos categoriesIds aparte si el repo lo soporta o preparamos el connect aquí)
    // Vamos a preparar el objeto completo para Prisma aquí para simplificar el repo
    const prismaCreateInput = {
      ...dataToCreate,
      // Si vienen categorías, las conectamos
      categories: categoryIds ? {
        connect: categoryIds.map(id => ({ id }))
      } : undefined
    };

    const result = await this.repository.createWithRelations(prismaCreateInput);

    // 4. Post-Event
    this.eventEmitter.emit('race:post:create', new DomainEvent({
      entityName: 'Race', action: 'post:create', payload: result
    }));

    return result;
  }

  async findAll(params?: any) {
    return this.repository.findAll(params);
  }

  async findOne(id: string) {
    return this.repository.findOne(id);
  }

  async update(id: string, updateDto: UpdateRaceDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'race:pre:update',
      new DomainEvent({
        entityName: 'Race',
        action: 'pre:update',
        payload: { id, ...updateDto },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.update(id, updateDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'race:post:update',
      new DomainEvent({
        entityName: 'Race',
        action: 'post:update',
        payload: result,
      }),
    );

    return result;
  }

  async remove(id: string) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'race:pre:delete',
      new DomainEvent({
        entityName: 'Race',
        action: 'pre:delete',
        payload: { id },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.remove(id);

    // 3. Post-Event
    this.eventEmitter.emit(
      'race:post:delete',
      new DomainEvent({
        entityName: 'Race',
        action: 'post:delete',
        payload: result,
      }),
    );

    return result;
  }
}
