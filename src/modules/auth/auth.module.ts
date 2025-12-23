import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt'; // NO importes JwtService aquí para providers
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { DashboardModule } from '../dashboard/dashboard.module';

@Module({
  imports: [
    DashboardModule,
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: (configService.get<string>('JWT_EXPIRES_IN') || '1d') as any, 
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
    providers: [AuthService, JwtStrategy], 
  
  exports: [AuthService, JwtModule, PassportModule]
})
export class AuthModule { }