import { PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateOrganizationDto {
  @IsString({ message: 'El nombre es obligatorio' })
  @IsNotEmpty()
  name: string;

  @IsString({ message: 'El slug es obligatorio' })
  @IsNotEmpty()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'El logo debe ser una URL válida' })
  logoUrl?: string;
}

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) { }

export type TOrganizationCreate = Prisma.OrganizationCreateInput;
export type TOrganizationUpdate = Prisma.OrganizationUpdateInput;
export type TOrganizationUniqueId = { id: string };
export type TOrganizationWhere = Prisma.OrganizationWhereInput;


