import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repository/payment.repository';

@Injectable()
export class PaymentUseCase {
  constructor(private readonly repository: PaymentRepository) {}

  // Aquí iría lógica CRUD simple que no requiere orquestación compleja
  // O clases específicas como 'CreateBicycleUseCase' si prefieres atomizar más
}
