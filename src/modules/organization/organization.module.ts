/**
 * Organization Module
 * Responsabilidad: Gestionar las Organizaciones (Clubes, Equipos, Organizadores de Eventos).
 * Ej. Crear el perfil del club 'MTB Guarico'.
 */
import { Module } from '@nestjs/common';
import { OrganizationService } from './service/organization.service';
import { OrganizationController } from './controller/organization.controller';
import { OrganizationRepository } from './repository/organization.repository';
import { OrganizationUseCase } from './usecase/organization.usecase';
import { PrismaService } from 'src/shared/service/prisma.service';

@Module({
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    OrganizationRepository,
    OrganizationUseCase,
    PrismaService
  ],
  exports: [OrganizationService]
})
export class OrganizationModule { }
