
/**
 * Race Timing Module
 * Responsabilidad: Gestionar los tiempos oficiales validados (Resultados, Cronometraje).
 * Ej. Calcular que el tiempo oficial fue 2h:15m:30s.
 */
import { Module } from '@nestjs/common';
import { RaceTimingService } from './service/race-timing.service';
import { RaceTimingController } from './controller/race-timing.controller';
import { RaceTimingRepository } from './repository/race-timing.repository';
import { PrismaService } from 'src/shared/service/prisma.service';

@Module({
    controllers: [RaceTimingController],
    providers: [
        RaceTimingService,
        RaceTimingRepository,
        PrismaService
    ],
    exports: [RaceTimingService]
})
export class RaceTimingModule { }
