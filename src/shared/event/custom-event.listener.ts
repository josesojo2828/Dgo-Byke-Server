import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LoggerService } from '../logger/logger.service';
import { DomainEvent } from './domain-listener';

@Injectable()
export class CustomEventListener {

  constructor(
    private readonly logger: LoggerService,
  ) { }

  @OnEvent('**')
  handleAllEvents(payload: DomainEvent) {
    this.logger.logInfo(`Evento ${payload.action} recibido por el usuario ${payload.userId} con id ${payload.payload.id}`);
  }
}