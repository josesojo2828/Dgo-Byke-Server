import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { CreateRaceDto, UpdateRaceDto, TRaceWhere, TRaceUniqueId } from '../interface/race.dto';
import { TRaceDetailInclude, TRaceListInclude } from 'src/shared/types/prisma.types';

@Injectable()
export class RaceRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createWithRelations(data: Prisma.RaceCreateInput) {
    return this.prisma.race.create({ data });
  }

  // Mantenemos el anterior por compatibilidad si se usa en otro lado
  async create(data: CreateRaceDto) {
    // ... lógica anterior
    return this.prisma.race.create({ data: data as any });
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
      include: TRaceListInclude, // <--- CAMBIO CLAVE: Usamos el include ligero para listas
      where: { ...where, deletedAt: null },
      orderBy,
    });
  }

  async findOne(id: string) {
    // Para el detalle usamos el pesado
    return this.prisma.race.findUnique({ where: { id }, include: TRaceDetailInclude });
  }
  async findUnique(where: TRaceUniqueId) {
    return this.prisma.race.findUnique({ where, include: TRaceDetailInclude });
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
