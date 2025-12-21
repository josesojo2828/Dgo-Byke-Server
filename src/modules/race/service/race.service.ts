import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RaceRepository } from '../repository/race.repository';
import { CreateRaceDto, UpdateRaceDto } from '../interface/race.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';

@Injectable()
export class RaceService {
  constructor(
    private readonly repository: RaceRepository,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async create(createDto: CreateRaceDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'race:pre:create',
      new DomainEvent({
        entityName: 'Race',
        action: 'pre:create',
        payload: createDto,
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.create(createDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'race:post:create',
      new DomainEvent({
        entityName: 'Race',
        action: 'post:create',
        payload: result,
      }),
    );

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
