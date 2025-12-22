import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { CreateOrganizationDto, UpdateOrganizationDto, TOrganizationWhere, TOrganizationUniqueId } from '../interface/organization.dto';

@Injectable()
export class OrganizationRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateOrganizationDto) {
    return this.prisma.organization.create({ data });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: TOrganizationUniqueId;
    where?: TOrganizationWhere;
    orderBy?: Prisma.OrganizationOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.organization.findMany({
      skip,
      take,
      cursor,
      where: { ...where, deletedAt: null },
      orderBy,
    });
  }

  async findOne(id: string) {
    return this.prisma.organization.findUnique({ where: { id } });
  }

  async findUnique(where: TOrganizationUniqueId) {
    return this.prisma.organization.findUnique({ where });
  }

  async update(id: string, data: UpdateOrganizationDto) {
    return this.prisma.organization.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.organization.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async count(where?: TOrganizationWhere) {
    return this.prisma.organization.count({ where: { ...where, deletedAt: null } });
  }
}
