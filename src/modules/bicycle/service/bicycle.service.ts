import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BicycleRepository } from '../repository/bicycle.repository';
import { CreateBicycleDto, UpdateBicycleDto } from '../interface/bicycle.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';

@Injectable()
export class BicycleService {
  constructor(
    private readonly repository: BicycleRepository,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async create(createDto: CreateBicycleDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'bicycle:pre:create',
      new DomainEvent({
        entityName: 'Bicycle',
        action: 'pre:create',
        payload: createDto,
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.create(createDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'bicycle:post:create',
      new DomainEvent({
        entityName: 'Bicycle',
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

  async update(id: string, updateDto: UpdateBicycleDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'bicycle:pre:update',
      new DomainEvent({
        entityName: 'Bicycle',
        action: 'pre:update',
        payload: { id, ...updateDto },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.update(id, updateDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'bicycle:post:update',
      new DomainEvent({
        entityName: 'Bicycle',
        action: 'post:update',
        payload: result,
      }),
    );

    return result;
  }

  async remove(id: string) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'bicycle:pre:delete',
      new DomainEvent({
        entityName: 'Bicycle',
        action: 'pre:delete',
        payload: { id },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.remove(id);

    // 3. Post-Event
    this.eventEmitter.emit(
      'bicycle:post:delete',
      new DomainEvent({
        entityName: 'Bicycle',
        action: 'post:delete',
        payload: result,
      }),
    );

    return result;
  }

  async findAllByProfile(profileId: string) {
    return this.repository.findAll({
      where: { cyclistProfileId: profileId }
    });
  }
}
