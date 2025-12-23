import { PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { IsUUID, IsInt, IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreateParticipantDto {
  @IsUUID('4', { message: 'ID de carrera inválido' })
  raceId: string;

  @IsString({ message: 'ID de perfil de ciclista inválido' })
  profileId: string;
}

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) {
  @IsOptional()
  @IsString()
  status?: string; // 'DNS', 'DNF', 'OK'

  @IsOptional()
  @IsInt()
  finalTime?: number;

  @IsOptional()
  @IsInt()
  rank?: number;
}

export type TRaceParticipantCreate = Prisma.RaceParticipantCreateInput;
export type TRaceParticipantUpdate = Prisma.RaceParticipantUpdateInput;
export type TRaceParticipantUniqueId = { id: string };
export type TRaceParticipantWhere = Prisma.RaceParticipantWhereInput;


