import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogisticsService } from './logistics.service';
import { SessionAuthGuard } from 'src/modules/auth/guard/session-auth-guard';
import { PermissionsGuard } from 'src/shared/guards/permissions.guard';
// import { RequirePermissions } from ... (Si tienes un permiso específico de logística)

@Controller('logistics')
@UseGuards(SessionAuthGuard, PermissionsGuard)
export class LogisticsController {
  constructor(private readonly service: LogisticsService) {}

  @Get('v1/dashboard')
  // @RequirePermissions(SystemPermissions.Logistics.Read) 
  getDashboardStats() {
    return this.service.getDashboardStats();
  }
}