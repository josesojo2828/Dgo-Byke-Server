
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrganizationMemberService } from '../service/organization-member.service';
import { CreateOrganizationMemberDto, UpdateOrganizationMemberDto } from '../interface/organization-member.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';

@Controller('organization-members')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OrganizationMemberController {
    constructor(private readonly service: OrganizationMemberService) { }

    @Post('v1')
    @RequirePermissions(SystemPermissions.OrganizationMembers.Create)
    create(@Body() createDto: CreateOrganizationMemberDto) {
        return this.service.create(createDto);
    }

    @Get('v1')
    @RequirePermissions(SystemPermissions.OrganizationMembers.Read)
    findAll() {
        return this.service.findAll();
    }

    @Get('v1/:id')
    @RequirePermissions(SystemPermissions.OrganizationMembers.Read)
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Patch('v1/:id')
    @RequirePermissions(SystemPermissions.OrganizationMembers.Update)
    update(@Param('id') id: string, @Body() updateDto: UpdateOrganizationMemberDto) {
        return this.service.update(id, updateDto);
    }

    @Delete('v1/:id')
    @RequirePermissions(SystemPermissions.OrganizationMembers.Delete)
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
