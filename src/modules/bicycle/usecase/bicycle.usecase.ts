import { Injectable } from '@nestjs/common';
import { BicycleRepository } from '../repository/bicycle.repository';

@Injectable()
export class BicycleUseCase {
  constructor(private readonly repository: BicycleRepository) {}

  // Aquí iría lógica CRUD simple que no requiere orquestación compleja
  // O clases específicas como 'CreateBicycleUseCase' si prefieres atomizar más
}
