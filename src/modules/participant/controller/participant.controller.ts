import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ParticipantService } from '../service/participant.service';
import { CreateParticipantDto, UpdateParticipantDto } from '../interface/participant.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';

@Controller('participants')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ParticipantController {
  constructor(private readonly service: ParticipantService) { }

  @Post('v1')
  @RequirePermissions(SystemPermissions.Participants.Create)
  create(@Body() createDto: CreateParticipantDto) {
    return this.service.create(createDto);
  }

  @Get('v1')
  @RequirePermissions(SystemPermissions.Participants.Read)
  findAll() {
    return this.service.findAll();
  }

  @Get('v1/:id')
  @RequirePermissions(SystemPermissions.Participants.Read)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch('v1/:id')
  @RequirePermissions(SystemPermissions.Participants.Update)
  update(@Param('id') id: string, @Body() updateDto: UpdateParticipantDto) {
    return this.service.update(id, updateDto);
  }

  @Delete('v1/:id')
  @RequirePermissions(SystemPermissions.Participants.Delete)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
