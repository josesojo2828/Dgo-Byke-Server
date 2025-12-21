import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RaceService } from '../service/race.service';
import { CreateRaceDto, UpdateRaceDto } from '../interface/race.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';

@Controller('races')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RaceController {
  constructor(private readonly service: RaceService) { }

  @Post('v1')
  @RequirePermissions(SystemPermissions.Races.Create)
  create(@Body() createDto: CreateRaceDto) {
    return this.service.create(createDto);
  }

  @Get('v1')
  @RequirePermissions(SystemPermissions.Races.Read)
  findAll() {
    return this.service.findAll();
  }

  @Get('v1/:id')
  @RequirePermissions(SystemPermissions.Races.Read)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch('v1/:id')
  @RequirePermissions(SystemPermissions.Races.Update)
  update(@Param('id') id: string, @Body() updateDto: UpdateRaceDto) {
    return this.service.update(id, updateDto);
  }

  @Delete('v1/:id')
  @RequirePermissions(SystemPermissions.Races.Delete)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
