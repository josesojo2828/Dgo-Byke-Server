import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { CreateCheckpointDto, UpdateCheckpointDto, TCheckpointWhere, TCheckpointUniqueId } from '../interface/checkpoint.dto';
import { TCheckpointListInclude } from 'src/shared/types/prisma.types';

@Injectable()
export class CheckpointRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateCheckpointDto) {
    return this.prisma.checkpoint.create({ data: data as unknown as Prisma.CheckpointUncheckedCreateInput });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: TCheckpointUniqueId;
    where?: TCheckpointWhere;
    orderBy?: Prisma.CheckpointOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.checkpoint.findMany({
      skip,
      take,
      include: TCheckpointListInclude,
      cursor,
      where: { ...where, deletedAt: null },
      orderBy,
    });
  }

  async findOne(id: string) {
    return this.prisma.checkpoint.findUnique({ where: { id },include: TCheckpointListInclude, });
  }

  async findUnique(where: TCheckpointUniqueId) {
    return this.prisma.checkpoint.findUnique({ where,include: TCheckpointListInclude, });
  }

  async update(id: string, data: UpdateCheckpointDto) {
    return this.prisma.checkpoint.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.checkpoint.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async count(where?: TCheckpointWhere) {
    return this.prisma.checkpoint.count({ where: { ...where, deletedAt: null } });
  }
}
