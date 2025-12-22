
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RaceTimingService } from '../service/race-timing.service';
import { CreateRaceTimingDto, UpdateRaceTimingDto } from '../interface/race-timing.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/permissions.decorator';
import { SystemPermissions } from '../../iam/system-permissions';
import { SessionAuthGuard } from 'src/modules/auth/guard/session-auth-guard';

@Controller('race-timing')
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class RaceTimingController {
    constructor(private readonly service: RaceTimingService) { }

    @Post('v1')
    @RequirePermissions(SystemPermissions.Timing.Record)
    create(@Body() createDto: CreateRaceTimingDto) {
        return this.service.create(createDto);
    }

    @Get('v1')
    @RequirePermissions(SystemPermissions.Timing.Read)
    findAll() {
        return this.service.findAll();
    }

    @Get('v1/:id')
    @RequirePermissions(SystemPermissions.Timing.Read)
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Patch('v1/:id')
    @RequirePermissions(SystemPermissions.Timing.Record)
    update(@Param('id') id: string, @Body() updateDto: UpdateRaceTimingDto) {
        return this.service.update(id, updateDto);
    }

    @Delete('v1/:id')
    @RequirePermissions(SystemPermissions.Timing.Delete)
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
