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

@Module({
  controllers: [AuditLogController],
  providers: [
    AuditLogService,
    AuditLogRepository,
    AuditLogUseCase,
    PrismaService
  ],
  exports: [AuditLogService]
})
export class AuditLogModule { }
