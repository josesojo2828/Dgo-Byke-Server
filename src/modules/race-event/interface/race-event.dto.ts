import { PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { IsUUID, IsString, IsNotEmpty, IsDateString, IsOptional, IsInt } from 'class-validator';

export class CreateRaceEventDto {
  @IsUUID('4')
  raceId: string;

  @IsUUID('4')
  participantId: string;

  @IsString()
  @IsNotEmpty()
  type: string; // 'LAP', 'CHECKPOINT', 'START', 'FINISH'

  @IsDateString({}, { message: 'Timestamp inválido' })
  timestamp: string; // Hora exacta del evento

  @IsOptional()
  @IsInt()
  value?: number; // Ej: Vuelta 1, Vuelta 2

  @IsOptional()
  @IsString()
  deviceUuid?: string;

  @IsOptional()
  @IsDateString()
  syncedAt?: string; // Hora en que se subió al server
}

export class UpdateRaceEventDto extends PartialType(CreateRaceEventDto) { }

export type TRaceEventCreate = Prisma.RaceEventCreateInput;
export type TRaceEventUpdate = Prisma.RaceEventUpdateInput;
export type TRaceEventUniqueId = { id: string };

