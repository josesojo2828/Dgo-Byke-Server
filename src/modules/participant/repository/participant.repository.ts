import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { UpdateParticipantDto, TRaceParticipantWhere, TRaceParticipantCreate } from '../interface/participant.dto';
import { TRaceParticipantDetailInclude, TRaceParticipantListInclude } from 'src/shared/types/prisma.types';

@Injectable()
export class ParticipantRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: TRaceParticipantCreate) {
    return this.prisma.raceParticipant.create({ data });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RaceParticipantWhereUniqueInput;
    where?: TRaceParticipantWhere;
    orderBy?: Prisma.RaceParticipantOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.raceParticipant.findMany({
      skip,
      take,
      cursor,
      include: TRaceParticipantListInclude,
      where: { ...where, deletedAt: null },
      orderBy,
    });
  }

  async findOne(id: string) {
    return this.prisma.raceParticipant.findUnique({ where: { id }, include: TRaceParticipantDetailInclude });
  }

  async findUnique(where: Prisma.RaceParticipantWhereUniqueInput) {
    return this.prisma.raceParticipant.findUnique({ where, include: TRaceParticipantDetailInclude });
  }

  async update(id: string, data: UpdateParticipantDto) {
    return this.prisma.raceParticipant.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.raceParticipant.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async count(where?: Prisma.RaceParticipantWhereInput) {
    return this.prisma.raceParticipant.count({ where: { ...where, deletedAt: null } });
  }
}
