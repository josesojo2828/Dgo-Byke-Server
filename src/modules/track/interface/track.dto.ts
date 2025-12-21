import { PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { IsString, IsNumber, IsNotEmpty, IsUUID, IsOptional, IsObject, Min } from 'class-validator';

export class CreateTrackDto {
  @IsString({ message: 'El nombre de la pista es obligatorio' })
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({}, { message: 'La distancia debe ser un número' })
  @Min(0, { message: 'La distancia debe ser positiva' })
  distanceKm: number;

  @IsOptional()
  @IsNumber()
  elevationGain?: number;

  @IsObject({ message: 'Los datos geográficos (GeoJSON) son obligatorios' })
  geoData: any;

  @IsUUID('4', { message: 'ID de organización inválido' })
  organizationId: string;
}

export class UpdateTrackDto extends PartialType(CreateTrackDto) { }

export type TTrackCreate = Prisma.TrackCreateInput;
export type TTrackUpdate = Prisma.TrackUpdateInput;
export type TTrackUniqueId = { id: string };
export type TTrackWhere = Prisma.TrackWhereInput;

