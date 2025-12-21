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

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentRepository,
    PaymentUseCase,
    PrismaService
  ],
  exports: [PaymentService]
})
export class PaymentModule { }
