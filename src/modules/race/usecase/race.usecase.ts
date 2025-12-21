import { Injectable } from '@nestjs/common';
import { RaceRepository } from '../repository/race.repository';

@Injectable()
export class RaceUseCase {
  constructor(private readonly repository: RaceRepository) {}

  // Aquí iría lógica CRUD simple que no requiere orquestación compleja
  // O clases específicas como 'CreateBicycleUseCase' si prefieres atomizar más
}
