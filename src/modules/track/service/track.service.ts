import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TrackRepository } from '../repository/track.repository';
import { CreateTrackDto, UpdateTrackDto } from '../interface/track.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';

@Injectable()
export class TrackService {
  constructor(
    private readonly repository: TrackRepository,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async create(createDto: CreateTrackDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'track:pre:create',
      new DomainEvent({
        entityName: 'Track',
        action: 'pre:create',
        payload: createDto,
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.create(createDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'track:post:create',
      new DomainEvent({
        entityName: 'Track',
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

  async update(id: string, updateDto: UpdateTrackDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'track:pre:update',
      new DomainEvent({
        entityName: 'Track',
        action: 'pre:update',
        payload: { id, ...updateDto },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.update(id, updateDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'track:post:update',
      new DomainEvent({
        entityName: 'Track',
        action: 'post:update',
        payload: result,
      }),
    );

    return result;
  }

  async remove(id: string) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'track:pre:delete',
      new DomainEvent({
        entityName: 'Track',
        action: 'pre:delete',
        payload: { id },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.remove(id);

    // 3. Post-Event
    this.eventEmitter.emit(
      'track:post:delete',
      new DomainEvent({
        entityName: 'Track',
        action: 'post:delete',
        payload: result,
      }),
    );

    return result;
  }
}
