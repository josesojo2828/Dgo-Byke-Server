import { Injectable } from '@nestjs/common';
import { CreateAuditLogDto, UpdateAuditLogDto } from '../interface/audit-log.dto';
import { PrismaService } from 'src/shared/service/prisma.service';

@Injectable()
export class AuditLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAuditLogDto) {
    // Ajustar 'modelName' al nombre real en tu schema.prisma
    // return this.prisma.modelName.create({ data });
    return 'create action in DB';
  }

  async findAll() {
    // return this.prisma.modelName.findMany();
    return 'findAll action in DB';
  }

  async findOne(id: string) {
    // return this.prisma.modelName.findUnique({ where: { id } });
    return 'findOne action in DB';
  }

  async update(id: string, data: UpdateAuditLogDto) {
    // return this.prisma.modelName.update({ where: { id }, data });
    return 'update action in DB';
  }

  async remove(id: string) {
    // return this.prisma.modelName.delete({ where: { id } });
    return 'remove action in DB';
  }
}
