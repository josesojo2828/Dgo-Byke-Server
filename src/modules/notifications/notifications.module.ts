/**
 * Notifications Module
 * Responsabilidad: Gestionar el envío de notificaciones (Email, Push, In-App).
 * Ej. Enviar email de confirmación de inscripción.
 */
import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [UserModule],
  providers: [NotificationsService,JwtService]
})
export class NotificationsModule { }
