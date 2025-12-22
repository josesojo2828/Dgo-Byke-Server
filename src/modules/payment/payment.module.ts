/**
 * Payment Module
 * Responsabilidad: Gestionar los pagos y transacciones (Inscripciones, Productos).
 * Ej. Procesar el pago de $20 por inscripción vía Stripe.
 */
import { Module } from '@nestjs/common';
import { PaymentService } from './service/payment.service';
import { PaymentController } from './controller/payment.controller';
import { PaymentRepository } from './repository/payment.repository';
import { PaymentUseCase } from './usecase/payment.usecase';
import { PrismaService } from 'src/shared/service/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentRepository,
    PaymentUseCase,
    PrismaService,
    JwtService
  ],
  exports: [PaymentService]
})
export class PaymentModule { }
