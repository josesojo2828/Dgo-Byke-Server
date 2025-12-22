import { Module, Global } from '@nestjs/common';
import { PrismaService } from './service/prisma.service';
import { LoggerService } from './logger/logger.service';

@Global()
@Module({
    providers: [PrismaService, LoggerService],
    exports: [PrismaService, LoggerService],
})
export class SharedModule { }
