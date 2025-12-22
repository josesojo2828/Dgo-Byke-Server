import { Module, Global } from '@nestjs/common';
import { PrismaService } from './service/prisma.service';
import { LoggerService } from './logger/logger.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';

@Global()
@Module({
    imports: [UserModule],
    providers: [PrismaService, LoggerService,JwtService],
    exports: [PrismaService, LoggerService],
})
export class SharedModule { }
