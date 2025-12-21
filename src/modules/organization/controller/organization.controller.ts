import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrganizationService } from '../service/organization.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../interface/organization.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';

@Controller('organizations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OrganizationController {
  constructor(private readonly service: OrganizationService) { }

  @Post('v1')
  @RequirePermissions(SystemPermissions.Organizations.Create)
  create(@Body() createDto: CreateOrganizationDto) {
    return this.service.create(createDto);
  }

  @Get('v1')
  @RequirePermissions(SystemPermissions.Organizations.Read)
  findAll() {
    return this.service.findAll();
  }

  @Get('v1/:id')
  @RequirePermissions(SystemPermissions.Organizations.Read)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch('v1/:id')
  @RequirePermissions(SystemPermissions.Organizations.Update)
  update(@Param('id') id: string, @Body() updateDto: UpdateOrganizationDto) {
    return this.service.update(id, updateDto);
  }

  @Delete('v1/:id')
  @RequirePermissions(SystemPermissions.Organizations.Delete)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
