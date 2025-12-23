import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNumber, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsEnum, IsObject, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';

// -------------------------------------------------------
// 1. DTO Base para crear Tracks (Lo que ya tenías)
// -------------------------------------------------------
export class CreateTrackDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  distanceKm: number;

  @IsOptional()
  @IsNumber()
  elevationGain?: number;

  @IsNotEmpty() // Puedes dejar esto para asegurar que no llegue vacío
  geoData: any;// O puedes ser más estricto aquí

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsString()
  organizationId: string;

  @IsOptional()
  description?: string
}

// -------------------------------------------------------
// 2. DTO ESPECÍFICO PARA EL PAYLOAD DEL MAPA (FRONTEND)
// -------------------------------------------------------
// Este DTO valida exactamente lo que manda tu código React: { lat, lng, type, name }
class TrackCheckpointPayload {
  // --- AGREGA ESTO PARA SOLUCIONAR EL ERROR ---
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  lat: number; // Frontend manda 'lat'

  @IsNumber()
  lng: number; // Frontend manda 'lng'

  @IsOptional()
  @IsString()
  type?: 'START' | 'FINISH' | 'CHECKPOINT';
}

// -------------------------------------------------------
// 3. UpdateTrackDto Actualizado
// -------------------------------------------------------
export class UpdateTrackDto extends PartialType(CreateTrackDto) {

  // Sobrescribimos o añadimos checkpoints con la estructura del Frontend
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrackCheckpointPayload) // <--- MAGIA: Usamos el DTO del payload, no el de la BD
  checkpoints?: TrackCheckpointPayload[];
}

// Tipos auxiliares
export type TTrackCreate = Prisma.TrackCreateInput;
export type TTrackUpdate = Prisma.TrackUpdateInput;