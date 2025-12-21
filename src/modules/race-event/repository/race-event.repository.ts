import { Injectable } from '@nestjs/common';
import { CreateRaceEventDto, UpdateRaceEventDto } from '../interface/race-event.dto';
import { PrismaService } from 'src/shared/service/prisma.service';

@Injectable()
export class RaceEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRaceEventDto) {
    // Ajustar 'modelName' al nombre real en tu schema.prisma
    // return this.prisma.modelName.create({ data });
    return 'create action in DB';
  }

  async findAll() {
    // return this.prisma.modelName.findMany();
    return 'findAll action in DB';
  }

  async findOne(id: string) {
    // return this.prisma.modelName.findUnique({ where: { id } });
    return 'findOne action in DB';
  }

  async update(id: string, data: UpdateRaceEventDto) {
    // return this.prisma.modelName.update({ where: { id }, data });
    return 'update action in DB';
  }

  async remove(id: string) {
    // return this.prisma.modelName.delete({ where: { id } });
    return 'remove action in DB';
  }
}
