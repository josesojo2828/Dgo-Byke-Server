import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { RaceService } from '../service/race.service';
import { CreateRaceDto, UpdateRaceDto } from '../interface/race.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';
import { SessionAuthGuard } from 'src/modules/auth/guard/session-auth-guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@Controller('races')
export class RaceController {
  constructor(private readonly service: RaceService) { }

  @Get('v1/form-data')
  @UseGuards(SessionAuthGuard)
  async getFormData(@CurrentUser() user: any) {
    return this.service.getFormDataForCreate(user.id);
  }

  @Get('v1/my-races')
  @UseGuards(SessionAuthGuard)
  async findMyRaces(@CurrentUser() user: any) {
    return this.service.findAllByOwner(user.id);
  }

  @Get('v1/dashboard/stats')
  @UseGuards(SessionAuthGuard)
  @RequirePermissions(SystemPermissions.Races.Read)
  getDashboardStats() {
    return this.service.getDashboardStats();
  }

  @Post('v1')
  @UseGuards(SessionAuthGuard)
  create(@Body() createDto: CreateRaceDto, @Req() req: any) {
    return this.service.create(createDto, req.user);
  }

  // @Get('v1/all')
  // findAll(@Query() query: { organizationId?: string }) {
  //   console.log(query);
  //   const results = this.service.findAll({ organizationId: query.organizationId });
  //   return results;
  // }

  @Get('v1')
  findAll(@Query() query: { organizationId?: string }) {
    console.log(query);
    const results = this.service.findAll({ organizationId: query.organizationId });
    return results;
  }

  @Get('v1/:id')
  async findOne(@Param('id') id: string) {
    const entity = await this.service.findOne(id);
    console.log(entity);
    return entity;
  }

  @Patch('v1/:id')
  @UseGuards(SessionAuthGuard)
  @RequirePermissions(SystemPermissions.Races.Update)
  update(@Param('id') id: string, @Body() updateDto: UpdateRaceDto) {
    return this.service.update(id, updateDto);
  }

  @Delete('v1/:id')
  @UseGuards(SessionAuthGuard)
  @RequirePermissions(SystemPermissions.Races.Delete)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
