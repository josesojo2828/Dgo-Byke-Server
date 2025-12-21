import { Injectable } from '@nestjs/common';
import { AuditLogRepository } from '../repository/audit-log.repository';
import { CreateAuditLogDto, UpdateAuditLogDto } from '../interface/audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(
    private readonly repository: AuditLogRepository,
    // private readonly eventEmitter: EventEmitter2 // Si usas eventos
  ) {}

  async create(createDto: CreateAuditLogDto) {
    // 1. Validaciones extra
    // 2. Llamada al repository
    const result = await this.repository.create(createDto);
    // 3. Disparar evento (ej: 'bicycle.created')
    return result;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    return this.repository.findOne(id);
  }

  async update(id: string, updateDto: UpdateAuditLogDto) {
    return this.repository.update(id, updateDto);
  }

  async remove(id: string) {
    return this.repository.remove(id);
  }
}
