/**
 * Race Module
 * Responsabilidad: Gestionar los eventos de carrera (Calendario, Configuración, Logística).
 * Ej. Configurar la 'Vuelta a la Azulita' para el 15 de Octubre.
 */
import { Module } from '@nestjs/common';
import { RaceService } from './service/race.service';
import { RaceController } from './controller/race.controller';
import { RaceRepository } from './repository/race.repository';
import { RaceUseCase } from './usecase/race.usecase';
import { PrismaService } from 'src/shared/service/prisma.service';

@Module({
  controllers: [RaceController],
  providers: [
    RaceService,
    RaceRepository,
    RaceUseCase,
    PrismaService
  ],
  exports: [RaceService]
})
export class RaceModule { }
