import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TrackService } from '../service/track.service';
import { CreateTrackDto, UpdateTrackDto } from '../interface/track.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';
import { SessionAuthGuard } from 'src/modules/auth/guard/session-auth-guard';

@Controller('tracks')
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class TrackController {
  constructor(private readonly service: TrackService) { }

  @Post('v1')
  @RequirePermissions(SystemPermissions.Tracks.Create)
  create(@Body() createDto: CreateTrackDto, @Req() req: any) {
    return this.service.create(createDto, req.user);
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
