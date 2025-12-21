import { Injectable } from '@nestjs/common';
import { RaceEventRepository } from '../repository/race-event.repository';
import { CreateRaceEventDto, UpdateRaceEventDto } from '../interface/race-event.dto';

@Injectable()
export class RaceEventService {
  constructor(
    private readonly repository: RaceEventRepository,
    // private readonly eventEmitter: EventEmitter2 // Si usas eventos
  ) {}

  async create(createDto: CreateRaceEventDto) {
    // 1. Validaciones extra
    // 2. Llamada al repository
    const result = await this.repository.create(createDto);
    // 3. Disparar evento (ej: 'bicycle.created')
    return result;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    return this.repository.findOne(id);
  }

  async update(id: string, updateDto: UpdateRaceEventDto) {
    return this.repository.update(id, updateDto);
  }

  async remove(id: string) {
    return this.repository.remove(id);
  }
}
