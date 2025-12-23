import { Prisma } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsInt,
  IsBoolean,
  IsOptional,
  Min,
  Max
} from 'class-validator';

export class CreateCheckpointDto {
  @IsString({ message: 'El nombre del punto es obligatorio' })
  @IsNotEmpty()
  name: string;

  // En la BD se llama 'latitude', validamos rango geográfico real
  @IsNumber({}, { message: 'La latitud debe ser un número' })
  @Min(-90)
  @Max(90)
  latitude: number;

  // En la BD se llama 'longitude'
  @IsNumber({}, { message: 'La longitud debe ser un número' })
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsInt({ message: 'El orden debe ser un número entero' })
  @Min(0)
  order: number;

  @IsOptional()
  @IsBoolean()
  isStart?: boolean;

  @IsOptional()
  @IsBoolean()
  isFinish?: boolean;

  // trackId es obligatorio si creas un checkpoint directamente
  // (aunque en el update masivo del TrackService se inyecta automáticamente)
  @IsUUID('4', { message: 'ID de Track inválido' })
  trackId: string;
}

export class UpdateCheckpointDto extends PartialType(CreateCheckpointDto) { }

// Tipos auxiliares de Prisma para consistencia en Service/Repo
export type TCheckpointCreate = Prisma.CheckpointCreateInput;
export type TCheckpointUpdate = Prisma.CheckpointUpdateInput;
export type TCheckpointUniqueId = Prisma.CheckpointWhereUniqueInput; // { id: string }
export type TCheckpointWhere = Prisma.CheckpointWhereInput;