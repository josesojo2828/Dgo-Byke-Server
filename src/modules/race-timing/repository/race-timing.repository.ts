
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { CreateRaceTimingDto, UpdateRaceTimingDto, TRaceTimingWhere, TRaceTimingUniqueId } from '../interface/race-timing.dto';

@Injectable()
export class RaceTimingRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateRaceTimingDto) {
        return this.prisma.raceTiming.create({ data });
    }

    async findAll(params?: {
        skip?: number;
        take?: number;
        cursor?: TRaceTimingUniqueId;
        where?: TRaceTimingWhere;
        orderBy?: Prisma.RaceTimingOrderByWithRelationInput;
    }) {
        const { skip, take, cursor, where, orderBy } = params || {};
        return this.prisma.raceTiming.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async findOne(id: string) {
        return this.prisma.raceTiming.findUnique({ where: { id } });
    }

    async findUnique(where: TRaceTimingUniqueId) {
        return this.prisma.raceTiming.findUnique({ where });
    }

    async update(id: string, data: UpdateRaceTimingDto) {
        return this.prisma.raceTiming.update({ where: { id }, data });
    }

    async remove(id: string) {
        return this.prisma.raceTiming.delete({ where: { id } });
    }

    async count(where?: TRaceTimingWhere) {
        return this.prisma.raceTiming.count({ where });
    }
}
