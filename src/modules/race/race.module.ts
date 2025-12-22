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
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [RaceController],
  providers: [
    RaceService,
    RaceRepository,
    RaceUseCase,
    PrismaService,
    JwtService,
  ],
  exports: [RaceService]
})
export class RaceModule { }
