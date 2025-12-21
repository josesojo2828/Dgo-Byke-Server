
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { IamService } from '../service/iam.service';
import { AssignPermissionDto, AssignRoleDto, CreatePermissionDto, CreateRoleDto } from '../interface/iam.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../system-permissions';

@Controller('iam')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class IamController {
    constructor(private readonly service: IamService) { }

    @Post('v1/roles')
    @RequirePermissions(SystemPermissions.System.Manage)
    createRole(@Body() dto: CreateRoleDto) {
        return this.service.createRole(dto);
    }

    @Get('v1/roles')
    @RequirePermissions(SystemPermissions.System.Manage)
    findAllRoles() {
        return this.service.findAllRoles();
    }

    @Post('v1/permissions')
    @RequirePermissions(SystemPermissions.System.Manage)
    createPermission(@Body() dto: CreatePermissionDto) {
        return this.service.createPermission(dto);
    }

    @Get('v1/permissions')
    @RequirePermissions(SystemPermissions.System.Manage)
    findAllPermissions() {
        return this.service.findAllPermissions();
    }

    @Post('v1/assign-permission')
    @RequirePermissions(SystemPermissions.System.Manage)
    async assignPermission(@Body() dto: AssignPermissionDto) {
        return this.service.assignPermissionToRole(dto);
    }

    @Post('v1/assign-role')
    @RequirePermissions(SystemPermissions.System.Manage)
    async assignRole(@Body() dto: AssignRoleDto) {
        return this.service.assignRoleToUser(dto);
    }
}
