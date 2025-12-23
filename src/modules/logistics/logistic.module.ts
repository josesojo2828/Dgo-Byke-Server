import { Module } from '@nestjs/common';
import { LogisticsController } from './logistics.controller';
import { LogisticsService } from './logistics.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/service/prisma.service';
import { UserModule } from '../user/user.module';

@Module({
    imports: [UserModule],
    controllers: [LogisticsController],
    providers: [LogisticsService, PrismaService, JwtService],
})
export class LogisticsModule { }