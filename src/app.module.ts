import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventModule } from './shared/event/event.module';
import { PrismaModule } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { AcceptLanguageResolver, I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';
import { DataFixtureService } from './shared/service/datafixture.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { InjectUserInterceptor } from './shared/interceptors/inject-user.interceptor';
import { SelectController } from './select.controller';
import { LoggerService } from './shared/logger/logger.service';
import { FakerInitService } from './shared/faker/faker-init.service';
import { UserCreatedListener } from './shared/event/modules/user/user.listener';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

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
  ],
  controllers: [
    AppController,
    SelectController
  ],
  providers: [
    DataFixtureService,
    LoggerService,
    FakerInitService,
    AppService,
    UserCreatedListener,
    
    {
      provide: APP_INTERCEPTOR,
      useClass: InjectUserInterceptor,
    }
  ],
})
export class AppModule { }
