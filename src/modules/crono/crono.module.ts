import { Module } from '@nestjs/common';
import { CronoController } from './controller/crono.controller';
import { CronoService } from './service/crono.service';
import { CronoRepository } from './repository/crono.repository';
import { CronoGateway } from './gateway/crono.gateway';
import { ProcessCaptureUseCase } from './usecase/process-capture.usecase';
import { GetLiveStandingsUseCase } from './usecase/get-live-standings.usecase';
import { PrismaService } from 'src/shared/service/prisma.service';

@Module({
    controllers: [CronoController],
    providers: [
        CronoService,
        CronoRepository,
        CronoGateway,
        ProcessCaptureUseCase,
        GetLiveStandingsUseCase,
        PrismaService // O si tienes un SharedModule, impórtalo en 'imports'
    ],
    exports: [CronoService,CronoRepository],
})
export class CronoModule { }