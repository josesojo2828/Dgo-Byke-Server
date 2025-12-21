/**
 * User Module
 * Responsabilidad: Gestionar los usuarios del sistema y sus perfiles (Ciclista, Admin, etc.).
 * Ej. Actualizar los datos personales o medidas corporales del ciclista.
 */
import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { UserRepository } from './repository/user.repository';
import { UserUseCase } from './usecase/user.usecase';
import { PrismaService } from 'src/shared/service/prisma.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserUseCase,
    PrismaService
  ],
  exports: [UserService]
})
export class UserModule { }
