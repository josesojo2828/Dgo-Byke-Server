import { Injectable } from '@nestjs/common';
import { AuditLogRepository } from '../repository/audit-log.repository';

@Injectable()
export class AuditLogUseCase {
  constructor(private readonly repository: AuditLogRepository) {}

  // Aquí iría lógica CRUD simple que no requiere orquestación compleja
  // O clases específicas como 'CreateBicycleUseCase' si prefieres atomizar más
}
