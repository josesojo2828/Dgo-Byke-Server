
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { OrganizationMemberService } from '../service/organization-member.service';
import { CreateOrganizationMemberDto, UpdateOrganizationMemberDto } from '../interface/organization-member.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';
import { SessionAuthGuard } from 'src/modules/auth/guard/session-auth-guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@Controller('organization-members')
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class OrganizationMemberController {
    constructor(private readonly service: OrganizationMemberService) { }

    @Get('v1/me/members')
    // No requiere permiso global de sistema, el servicio valida la autoría
    findMyMembers(
        @CurrentUser() user: any,
        @Query() query?: any
    ) {
        return this.service.findAllByOrganizer(user.id, query.ignore, query.search ? query.search : '');
    }

    @Get('v1/me/members/forrace')
    // No requiere permiso global de sistema, el servicio valida la autoría
    findMyMembersForRace(
        @CurrentUser() user: any,
        @Query() query: { search?: string, ignore?: string, raceId: string }
    ) {
        return this.service.findAllByOrganizerByRace(user.id, query);
    }

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
    // @RequirePermissions(SystemPermissions.OrganizationMembers.Update)
    update(@Param('id') id: string, @Body() updateDto: UpdateOrganizationMemberDto) {
        return this.service.update(id, updateDto);
    }

    @Delete('v1/:id')
    @RequirePermissions(SystemPermissions.OrganizationMembers.Delete)
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }

    // ID is CiclistProfileId
    @Patch('/v1/:id/index')
    async updateIndex(@Param('id') id: string, @Body() updateDto: { index: number }) {
        const entity = this.service.updateIndex(id, updateDto.index);
        return entity;
    }

    @Patch('/v1/:id/category/add')
    async updateCategoryAdd(@Param('id') id: string, @Body() updateDto: { categoryId: string }) {
        const entity = await this.service.addCategory(id, updateDto.categoryId);
        return entity;
    }

    @Patch('/v1/:id/category/remove')
    async updateCategoryRemove(@Param('id') id: string, @Body() updateDto: { categoryId: string }) {
        const entity = await this.service.removeCategory(id, updateDto.categoryId);
        return entity;
    }
}
