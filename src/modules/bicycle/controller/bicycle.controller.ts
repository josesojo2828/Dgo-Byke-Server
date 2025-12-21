import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BicycleService } from '../service/bicycle.service';
import { CreateBicycleDto, UpdateBicycleDto } from '../interface/bicycle.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';

@Controller('bicycles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BicycleController {
  constructor(private readonly service: BicycleService) { }

  @Post('v1')
  @RequirePermissions(SystemPermissions.Bicycles.Create)
  create(@Body() createDto: CreateBicycleDto) {
    return this.service.create(createDto);
  }

  @Get('v1')
  @RequirePermissions(SystemPermissions.Bicycles.Read)
  findAll() {
    return this.service.findAll();
  }

  @Get('v1/:id')
  @RequirePermissions(SystemPermissions.Bicycles.Read)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch('v1/:id')
  @RequirePermissions(SystemPermissions.Bicycles.Update)
  update(@Param('id') id: string, @Body() updateDto: UpdateBicycleDto) {
    return this.service.update(id, updateDto);
  }

  @Delete('v1/:id')
  @RequirePermissions(SystemPermissions.Bicycles.Delete)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
