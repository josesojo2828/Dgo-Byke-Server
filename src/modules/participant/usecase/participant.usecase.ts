import { Injectable } from '@nestjs/common';
import { ParticipantRepository } from '../repository/participant.repository';

@Injectable()
export class ParticipantUseCase {
  constructor(private readonly repository: ParticipantRepository) {}

  // Aquí iría lógica CRUD simple que no requiere orquestación compleja
  // O clases específicas como 'CreateBicycleUseCase' si prefieres atomizar más
}
