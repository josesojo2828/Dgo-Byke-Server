import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentRepository } from '../repository/payment.repository';
import { CreatePaymentDto, UpdatePaymentDto } from '../interface/payment.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';

@Injectable()
export class PaymentService {
  constructor(
    private readonly repository: PaymentRepository,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async create(createDto: CreatePaymentDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'payment:pre:create',
      new DomainEvent({
        entityName: 'Payment',
        action: 'pre:create',
        payload: createDto,
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.create(createDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'payment:post:create',
      new DomainEvent({
        entityName: 'Payment',
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

  async update(id: string, updateDto: UpdatePaymentDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'payment:pre:update',
      new DomainEvent({
        entityName: 'Payment',
        action: 'pre:update',
        payload: { id, ...updateDto },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.update(id, updateDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'payment:post:update',
      new DomainEvent({
        entityName: 'Payment',
        action: 'post:update',
        payload: result,
      }),
    );

    return result;
  }

  async remove(id: string) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'payment:pre:delete',
      new DomainEvent({
        entityName: 'Payment',
        action: 'pre:delete',
        payload: { id },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.remove(id);

    // 3. Post-Event
    this.eventEmitter.emit(
      'payment:post:delete',
      new DomainEvent({
        entityName: 'Payment',
        action: 'post:delete',
        payload: result,
      }),
    );

    return result;
  }
}
