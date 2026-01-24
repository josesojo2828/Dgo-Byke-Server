import { Module } from '@nestjs/common';
import { DashboardController } from './controller/dashboard.controller';
import { DashboardService } from './service/dashboard.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { PublicService } from './service/public.service';
import { PublicController } from './controller/public.controller';
import { FakerInitModule } from 'src/shared/faker/faker-init.module';
import { CronoModule } from '../crono/crono.module';

@Module({
    imports: [
        UserModule,
        FakerInitModule,
        CronoModule
    ],
    controllers: [DashboardController,PublicController],
    providers: [DashboardService,PublicService,JwtService],
    exports: [DashboardService]
})
export class DashboardModule { }
