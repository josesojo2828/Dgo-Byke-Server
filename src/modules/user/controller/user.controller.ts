import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto, UpdateUserDto } from '../interface/user.dto';
import { SessionAuthGuard } from '../../auth/guard/session-auth-guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@Controller('users')
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class UserController {
  constructor(private readonly service: UserService) { }

  @Get('v1/cyclist/my-organization')
  async getMyOrganization(@CurrentUser() user: any) {
    return this.service.getMyOrganizationDetail(user.id);
  }

  @Post('v1/cyclist/create-org')
  async createOrg(@CurrentUser() user: any, @Body() body: any) {
    return this.service.createOrganization(user.id, body);
  }

  @Get('v1/cyclist/organization-check')
  async checkOrgStatus(@CurrentUser() user: any) {
    return this.service.getMyOrganizationStatus(user.id);
  }

  @Get('v1/cyclist/results')
  async getCyclistResults(@CurrentUser() user: any) {
    return this.service.getCyclistResults(user.id);
  }

  @Get('v1/cyclist/profile')
  async getFullProfile(@CurrentUser() user: any) {
    return this.service.getFullProfile(user.id);
  }

  @Patch('v1/cyclist/profile')
  async updateFullProfile(@CurrentUser() user: any, @Body() updateDto: any) {
    return this.service.updateFullProfile(user.id, updateDto);
  }

  @Get('v1/cyclist/garage')
  async getMyGarage(@CurrentUser() user: any) {
    return this.service.getMyGarage(user.id);
  }

  @Post('v1/cyclist/garage')
  async createMyBike(@CurrentUser() user: any, @Body() body: any) {
    return this.service.createMyBike(user.id, body);
  }

  @Get('v1/cyclist/dashboard')
  async getCyclistDashboard(@CurrentUser() user: any) {
    return this.service.getCyclistDashboard(user.id);
  }

  @Get('v1/cyclist/tickets')
  async getMyTickets(@CurrentUser() user: any) {
    return this.service.getMyTickets(user.id);
  }

  @Get('v1/admins') // Este es el endpoint que usa tu hook useAdminsModule
  @RequirePermissions(SystemPermissions.System.Manage)
  findAdmins(
    @Query('search') search?: string,
    @Query('role') role?: string
  ) {
    // Reutilizamos el findAll pero pasando los filtros
    return this.service.findAll({ search, role });
  }

  @Post('v1')
  @RequirePermissions(SystemPermissions.Users.Create)
  create(@Body() createDto: CreateUserDto) {
    return this.service.create(createDto);
  }

  @Get('v1')
  findAll(@Query('search') search?: string) {
    return this.service.findAll({ search });
  }

  @Get('v1/:id')
  @RequirePermissions(SystemPermissions.Users.Read)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch('v1/:id')
  @RequirePermissions(SystemPermissions.Users.Update)
  update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return this.service.update(id, updateDto);
  }

  @Delete('v1/:id')
  @RequirePermissions(SystemPermissions.Users.Delete)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get('v1/dashboard/overview')
  @RequirePermissions(SystemPermissions.Users.Read)
  getDashboardOverview() {
    return this.service.getDashboardStats();
  }
}
