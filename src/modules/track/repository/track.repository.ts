import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { CreateTrackDto, UpdateTrackDto } from '../interface/track.dto';

@Injectable()
export class TrackRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateTrackDto) {
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
      where,
      orderBy,
    });
  }

  async findOne(id: string) {
    return this.prisma.track.findUnique({ where: { id } });
  }

  async findUnique(where: Prisma.TrackWhereUniqueInput) {
    return this.prisma.track.findUnique({ where });
  }

  async update(id: string, data: UpdateTrackDto) {
    return this.prisma.track.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.track.delete({ where: { id } });
  }

  async count(where?: Prisma.TrackWhereInput) {
    return this.prisma.track.count({ where });
  }
}
