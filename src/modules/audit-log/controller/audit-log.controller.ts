import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuditLogService } from '../service/audit-log.service';
import { CreateAuditLogDto, UpdateAuditLogDto } from '../interface/audit-log.dto';

@Controller('audit-logs') // Pluralizado manualmente en la ruta
export class AuditLogController {
  constructor(private readonly service: AuditLogService) {}

  @Post()
  create(@Body() createDto: CreateAuditLogDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateAuditLogDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
