
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
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    imports: [UserModule],
    controllers: [RaceTimingController],
    providers: [
        RaceTimingService,
        RaceTimingRepository,
        PrismaService,
        JwtService
    ],
    exports: [RaceTimingService]
})
export class RaceTimingModule { }
