import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { RaceService } from '../service/race.service';
import { CreateRaceDto, UpdateRaceDto } from '../interface/race.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';
import { SessionAuthGuard } from 'src/modules/auth/guard/session-auth-guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@Controller('races')
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class RaceController {
  constructor(private readonly service: RaceService) { }

  @Get('v1/form-data')
  async getFormData(@CurrentUser() user: any) {
    return this.service.getFormDataForCreate(user.id);
  }

  @Get('v1/my-races')
  async findMyRaces(@CurrentUser() user: any) {
    return this.service.findAllByOwner(user.id);
  }

  @Get('v1/dashboard/stats')
  @RequirePermissions(SystemPermissions.Races.Read)
  getDashboardStats() {
    return this.service.getDashboardStats();
  }

  @Post('v1')
  create(@Body() createDto: CreateRaceDto, @Req() req: any) {
    return this.service.create(createDto, req.user);
  }

  @Get('v1')
  findAll() {
    return this.service.findAll();
  }

  @Get('v1/:id')
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
