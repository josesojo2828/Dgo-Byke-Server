/**
 * Audit Log Module
 * Responsabilidad: Gestionar el historial de auditoría del sistema (acciones críticas, cambios de estado).
 * Ej. Registrar que el usuario X eliminó la carrera Y.
 */
import { Module } from '@nestjs/common';
import { AuditLogService } from './service/audit-log.service';
import { AuditLogController } from './controller/audit-log.controller';
import { AuditLogRepository } from './repository/audit-log.repository';
import { AuditLogUseCase } from './usecase/audit-log.usecase';
import { PrismaService } from 'src/shared/service/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuditLogController],
  providers: [
    AuditLogService,
    AuditLogRepository,
    AuditLogUseCase,
    PrismaService,
    JwtService
  ],
  exports: [AuditLogService]
})
export class AuditLogModule { }
