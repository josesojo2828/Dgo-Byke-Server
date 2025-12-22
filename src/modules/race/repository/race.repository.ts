import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { CreateRaceDto, UpdateRaceDto, TRaceWhere, TRaceUniqueId } from '../interface/race.dto';

@Injectable()
export class RaceRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateRaceDto) {
    return this.prisma.race.create({ data: data as unknown as Prisma.RaceUncheckedCreateInput });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: TRaceUniqueId;
    where?: TRaceWhere;
    orderBy?: Prisma.RaceOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.race.findMany({
      skip,
      take,
      cursor,
      where: { ...where, deletedAt: null },
      orderBy,
    });
  }

  async findOne(id: string) {
    return this.prisma.race.findUnique({ where: { id } });
  }

  async findUnique(where: TRaceUniqueId) {
    return this.prisma.race.findUnique({ where });
  }

  async update(id: string, data: UpdateRaceDto) {
    return this.prisma.race.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.race.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async count(where?: TRaceWhere) {
    return this.prisma.race.count({ where: { ...where, deletedAt: null } });
  }
}
