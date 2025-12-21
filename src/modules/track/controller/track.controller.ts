import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TrackService } from '../service/track.service';
import { CreateTrackDto, UpdateTrackDto } from '../interface/track.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';

@Controller('tracks')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TrackController {
  constructor(private readonly service: TrackService) { }

  @Post('v1')
  @RequirePermissions(SystemPermissions.Tracks.Create)
  create(@Body() createDto: CreateTrackDto) {
    return this.service.create(createDto);
  }

  @Get('v1')
  @RequirePermissions(SystemPermissions.Tracks.Read)
  findAll() {
    return this.service.findAll();
  }

  @Get('v1/:id')
  @RequirePermissions(SystemPermissions.Tracks.Read)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch('v1/:id')
  @RequirePermissions(SystemPermissions.Tracks.Update)
  update(@Param('id') id: string, @Body() updateDto: UpdateTrackDto) {
    return this.service.update(id, updateDto);
  }

  @Delete('v1/:id')
  @RequirePermissions(SystemPermissions.Tracks.Delete)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
