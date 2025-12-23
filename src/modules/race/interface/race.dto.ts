import { PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { IsString, IsNotEmpty, IsDateString, IsEnum, IsUUID, IsOptional, IsInt, IsNumber, Min, IsArray } from 'class-validator';
import { RaceType, RaceStatus } from 'src/shared/types/system.type';

export class CreateRaceDto {
  @IsString({ message: 'El nombre del evento es obligatorio' })
  @IsNotEmpty()
  name: string;

  @IsDateString({}, { message: 'La fecha debe tener formato ISO 8601' })
  date: string;

  @IsEnum(RaceType, { message: 'Tipo de carrera inválido' })
  type: RaceType;

  @IsUUID('4', { message: 'Organización inválida' })
  organizationId: string;

  @IsUUID('4', { message: 'Pista inválida' })
  trackId: string;

  // --- NUEVO: Array de IDs de categorías para asignarlas de una vez ---
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: string[];

  // Opcionales configuración
  @IsOptional()
  @IsInt()
  @Min(1)
  laps?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  locationName?: string;
}

export class UpdateRaceDto extends PartialType(CreateRaceDto) {
  @IsOptional()
  @IsEnum(RaceStatus)
  status?: RaceStatus;
}

export type TRaceCreate = Prisma.RaceCreateInput;
export type TRaceUpdate = Prisma.RaceUpdateInput;
export type TRaceUniqueId = { id: string };
export type TRaceWhere = Prisma.RaceWhereInput;

