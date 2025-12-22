import { PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsObject, IsUUID, IsBoolean } from 'class-validator';
import { BikeType } from 'src/shared/types/system.type';

export class CreateBicycleDto {
  // @IsUUID('4', { message: 'Debes especificar un perfil de ciclista válido' })
  @IsString({ message: 'Debes especificar un perfil de ciclista válido' })
  cyclistProfileId: string;

  @IsString({ message: 'La marca es obligatoria' })
  @IsNotEmpty({ message: 'La marca no puede estar vacía' })
  brand: string;

  @IsString({ message: 'El modelo es obligatorio' })
  @IsNotEmpty({ message: 'El modelo no puede estar vacío' })
  model: string;

  @IsEnum(BikeType, { message: 'El tipo de bicicleta no es válido (MTB, RUTA, etc.)' })
  type: BikeType;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsObject({ message: 'Las especificaciones deben ser un objeto JSON' })
  specs?: any;
}

export class UpdateBicycleDto extends PartialType(CreateBicycleDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export type TBicycleCreate = Prisma.BicycleCreateInput;
export type TBicycleUpdate = Prisma.BicycleUpdateInput;
export type TBicycleUniqueId = { id: string };
export type TBicycleWhere = Prisma.BicycleWhereInput;
