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
import { UserModule } from 'src/modules/user/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModule],
  controllers: [TrackController],
  providers: [
    TrackService,
    TrackRepository,
    TrackUseCase,
    PrismaService,
    JwtService
  ],
  exports: [TrackService]
})
export class TrackModule { }
