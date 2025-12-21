/**
 * Track Module
 * Responsabilidad: Gestionar las pistas y rutas (Metadata, Distancia, Elevación).
 * Ej. Guardar la ruta GPX de 45km con 1200m de desnivel.
 */
import { Module } from '@nestjs/common';
import { TrackService } from './service/track.service';
import { TrackController } from './controller/track.controller';
import { TrackRepository } from './repository/track.repository';
import { TrackUseCase } from './usecase/track.usecase';
import { PrismaService } from 'src/shared/service/prisma.service';

@Module({
  controllers: [TrackController],
  providers: [
    TrackService,
    TrackRepository,
    TrackUseCase,
    PrismaService
  ],
  exports: [TrackService]
})
export class TrackModule { }
