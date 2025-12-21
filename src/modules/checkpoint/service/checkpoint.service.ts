import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CheckpointRepository } from '../repository/checkpoint.repository';
import { CreateCheckpointDto, UpdateCheckpointDto } from '../interface/checkpoint.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';

@Injectable()
export class CheckpointService {
  constructor(
    private readonly repository: CheckpointRepository,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async create(createDto: CreateCheckpointDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'checkpoint:pre:create',
      new DomainEvent({
        entityName: 'Checkpoint',
        action: 'pre:create',
        payload: createDto,
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.create(createDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'checkpoint:post:create',
      new DomainEvent({
        entityName: 'Checkpoint',
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

  async update(id: string, updateDto: UpdateCheckpointDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'checkpoint:pre:update',
      new DomainEvent({
        entityName: 'Checkpoint',
        action: 'pre:update',
        payload: { id, ...updateDto },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.update(id, updateDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'checkpoint:post:update',
      new DomainEvent({
        entityName: 'Checkpoint',
        action: 'post:update',
        payload: result,
      }),
    );

    return result;
  }

  async remove(id: string) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'checkpoint:pre:delete',
      new DomainEvent({
        entityName: 'Checkpoint',
        action: 'pre:delete',
        payload: { id },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.remove(id);

    // 3. Post-Event
    this.eventEmitter.emit(
      'checkpoint:post:delete',
      new DomainEvent({
        entityName: 'Checkpoint',
        action: 'post:delete',
        payload: result,
      }),
    );

    return result;
  }
}
