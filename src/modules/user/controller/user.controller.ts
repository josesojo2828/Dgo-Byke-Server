import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto, UpdateUserDto } from '../interface/user.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UserController {
  constructor(private readonly service: UserService) { }

  @Post('v1')
  @RequirePermissions(SystemPermissions.Users.Create)
  create(@Body() createDto: CreateUserDto) {
    return this.service.create(createDto);
  }

  @Get('v1')
  @RequirePermissions(SystemPermissions.Users.Read)
  findAll() {
    return this.service.findAll();
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
}
