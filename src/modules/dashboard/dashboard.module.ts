import { Module } from '@nestjs/common';
import { DashboardController } from './controller/dashboard.controller';
import { DashboardService } from './service/dashboard.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        UserModule,
    ],
    controllers: [DashboardController],
    providers: [DashboardService,JwtService],
    exports: [DashboardService]
})
export class DashboardModule { }
