import { Injectable } from '@nestjs/common';
import { CheckpointRepository } from '../repository/checkpoint.repository';

@Injectable()
export class CheckpointUseCase {
  constructor(private readonly repository: CheckpointRepository) {}

  // Aquí iría lógica CRUD simple que no requiere orquestación compleja
  // O clases específicas como 'CreateBicycleUseCase' si prefieres atomizar más
}
