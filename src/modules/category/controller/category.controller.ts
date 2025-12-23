import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../interface/category.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';
import { SessionAuthGuard } from 'src/modules/auth/guard/session-auth-guard';

@Controller('categories')
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class CategoryController {
  constructor(private readonly service: CategoryService) { }

  @Post('v1')
  @RequirePermissions(SystemPermissions.Categories.Create)
  create(@Body() createDto: CreateCategoryDto) {  
    return this.service.create(createDto);
  }

  @Get('v1')
  findAll() {
    return this.service.findAll();
  }

  @Get('v1/:id')
  @RequirePermissions(SystemPermissions.Categories.Read)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch('v1/:id')
  @RequirePermissions(SystemPermissions.Categories.Update)
  update(@Param('id') id: string, @Body() updateDto: UpdateCategoryDto) {
    return this.service.update(id, updateDto);
  }

  @Delete('v1/:id')
  @RequirePermissions(SystemPermissions.Categories.Delete)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
