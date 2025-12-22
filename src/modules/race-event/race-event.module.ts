/**
 * Race Event Module
 * Responsabilidad: Gestionar eventos en vivo de la carrera (Vueltas, Pasos raw, Sincronización).
 * Ej. Recibir el ping de que el chip 101 pasó por meta.
 */
import { Module } from '@nestjs/common';
import { RaceEventService } from './service/race-event.service';
import { RaceEventController } from './controller/race-event.controller';
import { RaceEventRepository } from './repository/race-event.repository';
import { RaceEventUseCase } from './usecase/race-event.usecase';
import { PrismaService } from 'src/shared/service/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [RaceEventController],
  providers: [
    RaceEventService,
    RaceEventRepository,
    RaceEventUseCase,
    PrismaService,
    JwtService,
  ],
  exports: [RaceEventService]
})
export class RaceEventModule { }
