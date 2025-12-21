
import { Prisma } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';

export class CreateRaceTimingDto {
    participantId: string;
    checkpointId: string;
    raceId: string;
    raceEventId?: string; // Optional link to raw event
    recordedAt: Date;
}

export class UpdateRaceTimingDto {
    recordedAt?: Date;
}
export type TRaceTimingCreate = Prisma.RaceTimingCreateInput;
export type TRaceTimingUpdate = Prisma.RaceTimingUpdateInput;
export type TRaceTimingUniqueId = { id: string };
export type TRaceTimingWhere = Prisma.RaceTimingWhereInput;
