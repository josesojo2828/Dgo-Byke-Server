/**
 * Participant Module
 * Responsabilidad: Gestionar los participantes de una carrera, asignación de dorsales y bicicletas.
 * Ej. Inscribir al ciclista X en la carrera Y con el dorsal 101.
 */
import { Module } from '@nestjs/common';
import { ParticipantService } from './service/participant.service';
import { ParticipantController } from './controller/participant.controller';
import { ParticipantRepository } from './repository/participant.repository';
import { ParticipantUseCase } from './usecase/participant.usecase';
import { PrismaService } from 'src/shared/service/prisma.service';

@Module({
  controllers: [ParticipantController],
  providers: [
    ParticipantService,
    ParticipantRepository,
    ParticipantUseCase,
    PrismaService
  ],
  exports: [ParticipantService]
})
export class ParticipantModule { }
