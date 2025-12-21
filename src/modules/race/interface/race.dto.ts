import { PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { IsString, IsNotEmpty, IsDateString, IsEnum, IsUUID, IsOptional, IsInt, IsNumber, Min } from 'class-validator';
import { RaceType, RaceStatus } from 'src/shared/types/system.type';

export class CreateRaceDto {
  @IsString({ message: 'El nombre del evento es obligatorio' })
  @IsNotEmpty()
  name: string;

  @IsDateString({}, { message: 'La fecha debe tener formato ISO 8601' })
  date: string; // Se recibe como string desde el front

  @IsEnum(RaceType, { message: 'Tipo de carrera inválido' })
  type: RaceType;

  @IsUUID('4', { message: 'Organización inválida' })
  organizationId: string;

  @IsUUID('4', { message: 'Pista inválida' })
  trackId: string;

  // Nota: creatorId se suele sacar del Token JWT, no del body, pero lo dejo opcional por si acaso
  @IsOptional()
  @IsUUID()
  creatorId?: string;

  @IsOptional()
  @IsInt({ message: 'Las vueltas deben ser un número entero' })
  @Min(1)
  laps?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El precio debe ser un número' })
  price?: number;
}

export class UpdateRaceDto extends PartialType(CreateRaceDto) {
  @IsOptional()
  @IsEnum(RaceStatus, { message: 'Estado de carrera inválido' })
  status?: RaceStatus;

  @IsOptional()
  @IsString()
  locationName?: string;
}

export type TRaceCreate = Prisma.RaceCreateInput;
export type TRaceUpdate = Prisma.RaceUpdateInput;
export type TRaceUniqueId = { id: string };
export type TRaceWhere = Prisma.RaceWhereInput;

