/**
 * Bicycle Module
 * Responsabilidad: Gestionar el inventario de bicicletas de los usuarios (CRUD, asociación a perfil).
 * Ej. Registrar una nueva Specialized Tarmac SL7 para un usuario.
 */
import { Module } from '@nestjs/common';
import { BicycleService } from './service/bicycle.service';
import { BicycleController } from './controller/bicycle.controller';
import { BicycleRepository } from './repository/bicycle.repository';
import { BicycleUseCase } from './usecase/bicycle.usecase';
import { PrismaService } from 'src/shared/service/prisma.service';

@Module({
  controllers: [BicycleController],
  providers: [
    BicycleService,
    BicycleRepository,
    BicycleUseCase,
    PrismaService
  ],
  exports: [BicycleService]
})
export class BicycleModule { }
