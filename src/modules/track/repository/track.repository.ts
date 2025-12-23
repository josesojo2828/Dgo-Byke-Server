import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { UpdateTrackDto,TTrackCreate, TTrackUpdate } from '../interface/track.dto';
import { TTrackDetailInclude } from 'src/shared/types/prisma.types';

@Injectable()
export class TrackRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: TTrackCreate) {
    return this.prisma.track.create({ data });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TrackWhereUniqueInput;
    where?: Prisma.TrackWhereInput;
    orderBy?: Prisma.TrackOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.track.findMany({
      skip,
      take,
      cursor,
      include: TTrackDetailInclude,
      where: { ...where, deletedAt: null },
      orderBy,
    });
  }

  async findOne(id: string) {
    return this.prisma.track.findUnique({ where: { id },include: TTrackDetailInclude });
  }

  async findUnique(where: Prisma.TrackWhereUniqueInput) {
    return this.prisma.track.findUnique({ where });
  }

  async update(id: string, data: TTrackUpdate) {
    return this.prisma.track.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.track.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async count(where?: Prisma.TrackWhereInput) {
    return this.prisma.track.count({ where: { ...where, deletedAt: null } });
  }
}
