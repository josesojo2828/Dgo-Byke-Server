import { Injectable } from '@nestjs/common';
import { TrackRepository } from '../repository/track.repository';

@Injectable()
export class TrackUseCase {
  constructor(private readonly repository: TrackRepository) {}

  // Aquí iría lógica CRUD simple que no requiere orquestación compleja
  // O clases específicas como 'CreateBicycleUseCase' si prefieres atomizar más
}
