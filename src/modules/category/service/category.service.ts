import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CategoryRepository } from '../repository/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '../interface/category.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';

@Injectable()
export class CategoryService {
  constructor(
    private readonly repository: CategoryRepository,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async create(createDto: CreateCategoryDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'category:pre:create',
      new DomainEvent({
        entityName: 'Category',
        action: 'pre:create',
        payload: createDto,
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.create(createDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'category:post:create',
      new DomainEvent({
        entityName: 'Category',
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

  async update(id: string, updateDto: UpdateCategoryDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'category:pre:update',
      new DomainEvent({
        entityName: 'Category',
        action: 'pre:update',
        payload: { id, ...updateDto },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.update(id, updateDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'category:post:update',
      new DomainEvent({
        entityName: 'Category',
        action: 'post:update',
        payload: result,
      }),
    );

    return result;
  }

  async remove(id: string) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'category:pre:delete',
      new DomainEvent({
        entityName: 'Category',
        action: 'pre:delete',
        payload: { id },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.remove(id);

    // 3. Post-Event
    this.eventEmitter.emit(
      'category:post:delete',
      new DomainEvent({
        entityName: 'Category',
        action: 'post:delete',
        payload: result,
      }),
    );

    return result;
  }
}
