import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../modules/auth/guard/jwt-auth.guard';
import { CurrentUser } from '../../../shared/decorators/permissions.decorator';
import { DashboardService } from '../service/dashboard.service';
import { DashboardStatsDto, MenuItemDto } from '../interface/dashboard.dto';
import { SessionAuthGuard } from 'src/modules/auth/guard/session-auth-guard';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(SessionAuthGuard)
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    // @Get('menu')
    // @ApiOperation({ summary: 'Get dynamic sidebar menu based on permissions' })
    // @ApiResponse({ status: 200, type: [MenuItemDto] })
    // getMenu(@CurrentUser() user: any) {
    //     return this.dashboardService.getMenu(user);
    // }

    // @Get('stats')
    // @ApiOperation({ summary: 'Get dashboard KPI statistics' })
    // @ApiResponse({ status: 200, type: DashboardStatsDto })
    // getStats() {
    //     return this.dashboardService.getStats();
    // }
}
