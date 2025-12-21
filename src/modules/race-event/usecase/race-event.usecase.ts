import { Injectable } from '@nestjs/common';
import { RaceEventRepository } from '../repository/race-event.repository';

@Injectable()
export class RaceEventUseCase {
  constructor(private readonly repository: RaceEventRepository) {}

  // Aquí iría lógica CRUD simple que no requiere orquestación compleja
  // O clases específicas como 'CreateBicycleUseCase' si prefieres atomizar más
}
