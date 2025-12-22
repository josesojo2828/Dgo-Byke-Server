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
import { JwtService } from '@nestjs/jwt';
import { CyclistProfileService } from './service/cyclist-profile.service';
import { CyclistProfileController } from './controller/cyclist-profile.controller';

@Module({
  imports: [UserModule],
  controllers: [UserController, CyclistProfileController],
  providers: [
    UserService,
    UserRepository,
    UserUseCase,
    CyclistProfileService,
    JwtService,
  ],
  exports: [UserService,CyclistProfileService]
})
export class UserModule { }
