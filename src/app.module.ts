import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventModule } from './shared/event/event.module';
import { PrismaModule } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { PrismaService } from './shared/service/prisma.service';
import { DataFixtureService } from './shared/service/datafixture.service';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { LoggerService } from './shared/logger/logger.service';
import { FakerInitService } from './shared/faker/faker-init.service';
import { CustomEventListener } from './shared/event/custom-event.listener';
import { DataSeederService } from './shared/service/data-seeder.service';
import { TransformResponseInterceptor } from './shared/interceptor/transform-response.interceptor';
import { PerformanceInterceptor } from './shared/interceptor/performance.interceptor';
import { GlobalExceptionFilter } from './shared/error/global-exception.filter';
import { UserModule } from './modules/user/user.module';
import { BicycleModule } from './modules/bicycle/bicycle.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { TrackModule } from './modules/track/track.module';
import { CategoryModule } from './modules/category/category.module';
import { RaceModule } from './modules/race/race.module';
import { ParticipantModule } from './modules/participant/participant.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { RaceEventModule } from './modules/race-event/race-event.module';
import { OrganizationMemberModule } from './modules/organization-member/organization-member.module';
import { CheckpointModule } from './modules/checkpoint/checkpoint.module';
import { RaceTimingModule } from './modules/race-timing/race-timing.module';
import { IamModule } from './modules/iam/iam.module';
import { PaymentModule } from './modules/payment/payment.module';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/files.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    SharedModule,

    // FastifyMulterModule,

    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.'
    }),

    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const logLevel = configService.get<string>('PRISMA_LOG_LEVEL', 'warn');
        const explicitConnect = configService.get<boolean>('PRISMA_EXPLICIT_CONNECT', false);
        if (!databaseUrl) {
          throw new Error('DATABASE_URL environment variable is not set');
        }

        return {
          prismaOptions: {
            log: [logLevel as Prisma.LogLevel], // Cast al tipo correcto
            datasources: {
              db: {
                url: databaseUrl,
              },
            },
          },
          explicitConnect: explicitConnect,
        };
      },
      inject: [ConfigService],
    }),

    EventModule,

    UserModule,
    BicycleModule,
    OrganizationModule,
    TrackModule,
    CategoryModule,
    RaceModule,
    ParticipantModule,
    RaceEventModule,
    RaceEventModule,
    AuditLogModule,
    OrganizationMemberModule,
    CheckpointModule,
    RaceTimingModule,
    IamModule,
    PaymentModule,
    AuthModule,
    FilesModule,
    NotificationsModule,
    DashboardModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    CustomEventListener,
    DataSeederService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    }
  ],
})
export class AppModule { }
