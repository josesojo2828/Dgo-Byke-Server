/**
 * Notifications Module
 * Responsabilidad: Gestionar el envío de notificaciones (Email, Push, In-App).
 * Ej. Enviar email de confirmación de inscripción.
 */
import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Module({
  providers: [NotificationsService]
})
export class NotificationsModule { }
