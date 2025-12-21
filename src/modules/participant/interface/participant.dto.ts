import { PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { IsUUID, IsInt, IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreateParticipantDto {
  @IsUUID('4', { message: 'ID de carrera inválido' })
  raceId: string;

  @IsUUID('4', { message: 'ID de perfil de ciclista inválido' })
  profileId: string;

  @IsInt({ message: 'El dorsal (número) es obligatorio' })
  bibNumber: number;

  @IsOptional()
  @IsUUID('4', { message: 'ID de bicicleta inválido' })
  bicycleId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'ID de categoría inválido' })
  categoryAssignedId?: string;

  @IsOptional()
  @IsBoolean()
  hasPaid?: boolean;
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


