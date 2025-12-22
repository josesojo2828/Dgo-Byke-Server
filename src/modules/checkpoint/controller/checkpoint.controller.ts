import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CheckpointService } from '../service/checkpoint.service';
import { CreateCheckpointDto, UpdateCheckpointDto } from '../interface/checkpoint.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';
import { SessionAuthGuard } from 'src/modules/auth/guard/session-auth-guard';

@Controller('checkpoints')
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class CheckpointController {
  constructor(private readonly service: CheckpointService) { }

  @Post('v1')
  @RequirePermissions(SystemPermissions.Checkpoints.Create)
  create(@Body() createDto: CreateCheckpointDto) {
    return this.service.create(createDto);
  }

  @Get('v1')
  @RequirePermissions(SystemPermissions.Checkpoints.Read)
  findAll() {
    return this.service.findAll();
  }

  @Get('v1/:id')
  @RequirePermissions(SystemPermissions.Checkpoints.Read)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch('v1/:id')
  @RequirePermissions(SystemPermissions.Checkpoints.Update)
  update(@Param('id') id: string, @Body() updateDto: UpdateCheckpointDto) {
    return this.service.update(id, updateDto);
  }

  @Delete('v1/:id')
  @RequirePermissions(SystemPermissions.Checkpoints.Delete)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
