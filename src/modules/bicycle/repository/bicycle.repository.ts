import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { CreateBicycleDto, UpdateBicycleDto } from '../interface/bicycle.dto';

@Injectable()
export class BicycleRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateBicycleDto) {
    return this.prisma.bicycle.create({ data });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BicycleWhereUniqueInput;
    where?: Prisma.BicycleWhereInput;
    orderBy?: Prisma.BicycleOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.bicycle.findMany({
      skip,
      take,
      cursor,
      where: { ...where, deletedAt: null },
      orderBy,
    });
  }

  async findOne(id: string) {
    return this.prisma.bicycle.findUnique({ where: { id } });
  }

  async findUnique(where: Prisma.BicycleWhereUniqueInput) {
    return this.prisma.bicycle.findUnique({ where });
  }

  async update(id: string, data: UpdateBicycleDto) {
    return this.prisma.bicycle.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.bicycle.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async count(where?: Prisma.BicycleWhereInput) {
    return this.prisma.bicycle.count({ where: { ...where, deletedAt: null } });
  }
}
