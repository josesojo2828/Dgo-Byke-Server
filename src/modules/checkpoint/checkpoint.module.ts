/**
 * Checkpoint Module
 * Responsabilidad: Gestionar los puntos de control geolocalizados dentro de un Track/Ruta.
 * Ej. Definir el 'Punto de Hidratación' en el km 40.
 */
import { Module } from '@nestjs/common';
import { CheckpointService } from './service/checkpoint.service';
import { CheckpointController } from './controller/checkpoint.controller';
import { CheckpointRepository } from './repository/checkpoint.repository';
import { CheckpointUseCase } from './usecase/checkpoint.usecase';
import { PrismaService } from 'src/shared/service/prisma.service';

@Module({
  controllers: [CheckpointController],
  providers: [
    CheckpointService,
    CheckpointRepository,
    CheckpointUseCase,
    PrismaService
  ],
  exports: [CheckpointService]
})
export class CheckpointModule { }
