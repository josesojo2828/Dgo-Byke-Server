import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../interface/category.dto';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateCategoryDto) {
    return this.prisma.category.create({ data });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CategoryWhereUniqueInput;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.category.findMany({
      skip,
      take,
      cursor,
      where: { ...where, deletedAt: null },
      orderBy,
    });
  }

  async findOne(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async findUnique(where: Prisma.CategoryWhereUniqueInput) {
    return this.prisma.category.findUnique({ where });
  }

  async update(id: string, data: UpdateCategoryDto) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.category.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async count(where?: Prisma.CategoryWhereInput) {
    return this.prisma.category.count({ where: { ...where, deletedAt: null } });
  }
}
