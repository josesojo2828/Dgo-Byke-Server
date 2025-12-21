
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RaceTimingRepository } from '../repository/race-timing.repository';
import { CreateRaceTimingDto, UpdateRaceTimingDto } from '../interface/race-timing.dto';
import { PrismaService } from 'src/shared/service/prisma.service';
import { DomainEvent } from 'src/shared/event/domain-listener';

@Injectable()
export class RaceTimingService {
    constructor(
        private readonly repository: RaceTimingRepository,
        private readonly prisma: PrismaService,
        private readonly eventEmitter: EventEmitter2
    ) { }

    async create(createDto: CreateRaceTimingDto) {
        // Validation: Checkpoint must belong to the Track of the Race
        const race = await this.prisma.race.findUnique({
            where: { id: createDto.raceId },
            select: { trackId: true },
        });

        if (!race) {
            throw new NotFoundException('Race not found');
        }

        const checkpoint = await this.prisma.checkpoint.findUnique({
            where: { id: createDto.checkpointId },
            select: { trackId: true },
        });

        if (!checkpoint) {
            throw new NotFoundException('Checkpoint not found');
        }

        if (race.trackId !== checkpoint.trackId) {
            throw new BadRequestException('Checkpoint does not belong to the track of this race');
        }

        // 1. Pre-Event
        this.eventEmitter.emit(
            'race-timing:pre:create',
            new DomainEvent({
                entityName: 'RaceTiming',
                action: 'pre:create',
                payload: createDto,
            }),
        );

        // 2. Repository Logic
        const result = await this.repository.create(createDto);

        // 3. Post-Event
        this.eventEmitter.emit(
            'race-timing:post:create',
            new DomainEvent({
                entityName: 'RaceTiming',
                action: 'post:create',
                payload: result,
            }),
        );

        return result;
    }

    async findAll(params?: any) {
        return this.repository.findAll(params);
    }

    async findOne(id: string) {
        return this.repository.findOne(id);
    }

    async update(id: string, updateDto: UpdateRaceTimingDto) {
        // 1. Pre-Event
        this.eventEmitter.emit(
            'race-timing:pre:update',
            new DomainEvent({
                entityName: 'RaceTiming',
                action: 'pre:update',
                payload: { id, ...updateDto },
            }),
        );

        // 2. Repository Logic
        const result = await this.repository.update(id, updateDto);

        // 3. Post-Event
        this.eventEmitter.emit(
            'race-timing:post:update',
            new DomainEvent({
                entityName: 'RaceTiming',
                action: 'post:update',
                payload: result,
            }),
        );

        return result;
    }

    async remove(id: string) {
        // 1. Pre-Event
        this.eventEmitter.emit(
            'race-timing:pre:delete',
            new DomainEvent({
                entityName: 'RaceTiming',
                action: 'pre:delete',
                payload: { id },
            }),
        );

        // 2. Repository Logic
        const result = await this.repository.remove(id);

        // 3. Post-Event
        this.eventEmitter.emit(
            'race-timing:post:delete',
            new DomainEvent({
                entityName: 'RaceTiming',
                action: 'post:delete',
                payload: result,
            }),
        );

        return result;
    }
}
