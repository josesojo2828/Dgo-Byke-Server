import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrganizationRepository } from '../repository/organization.repository';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../interface/organization.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly repository: OrganizationRepository,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async create(createDto: CreateOrganizationDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'organization:pre:create',
      new DomainEvent({
        entityName: 'Organization',
        action: 'pre:create',
        payload: createDto,
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.create(createDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'organization:post:create',
      new DomainEvent({
        entityName: 'Organization',
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

  async update(id: string, updateDto: UpdateOrganizationDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'organization:pre:update',
      new DomainEvent({
        entityName: 'Organization',
        action: 'pre:update',
        payload: { id, ...updateDto },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.update(id, updateDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'organization:post:update',
      new DomainEvent({
        entityName: 'Organization',
        action: 'post:update',
        payload: result,
      }),
    );

    return result;
  }

  async remove(id: string) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'organization:pre:delete',
      new DomainEvent({
        entityName: 'Organization',
        action: 'pre:delete',
        payload: { id },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.remove(id);

    // 3. Post-Event
    this.eventEmitter.emit(
      'organization:post:delete',
      new DomainEvent({
        entityName: 'Organization',
        action: 'post:delete',
        payload: result,
      }),
    );

    return result;
  }
}
