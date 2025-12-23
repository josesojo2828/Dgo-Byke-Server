import { PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { IsString, IsInt, IsOptional, Min, Max, IsNotEmpty, IsArray, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'El nombre es obligatorio' })
  @IsNotEmpty({ message: 'El nombre de la categoría no puede estar vacío' })
  name: string;

  @IsOptional()
  @IsInt({ message: 'La edad mínima debe ser un número entero' })
  @Min(0, { message: 'La edad mínima no puede ser negativa' })
  minAge?: number;

  @IsOptional()
  @IsInt({ message: 'La edad máxima debe ser un número entero' })
  @Max(100, { message: 'La edad máxima no puede exceder 100 años' })
  maxAge?: number;

  @IsOptional()
  @IsString()
  gender?: string; // 'M', 'F', 'MIXTO'

  @IsArray()
  @IsUUID('4', { each: true }) // Valida que cada item sea un UUID
  categoryIds: string[];
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }

export type TCategoryCreate = Prisma.CategoryCreateInput;
export type TCategoryUpdate = Prisma.CategoryUpdateInput;
export type TCategoryUniqueId = { id: string };
export type TCategoryWhere = Prisma.CategoryWhereInput;

