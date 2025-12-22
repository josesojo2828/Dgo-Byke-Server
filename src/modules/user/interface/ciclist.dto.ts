import { IsString, IsNumber, IsOptional, IsEnum, Min, Max } from 'class-validator';

export class CreateCyclistProfileDto {
  @IsNumber()
  @Min(30)
  @Max(200)
  weight: number;

  @IsNumber()
  @Min(100)
  @Max(250)
  height: number;

  @IsString()
  jerseySize: string;

  @IsString()
  bloodType: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsString()
  emergencyContactName: string;

  @IsString()
  emergencyContactPhone: string;

  @IsOptional()
  @IsString()
  teamName?: string;
}

// Para el update extendemos con PartialType de @nestjs/swagger o @nestjs/mapped-types
import { PartialType } from '@nestjs/mapped-types'; // o swagger
import { Prisma } from '@prisma/client';
export class UpdateCyclistProfileDto extends PartialType(CreateCyclistProfileDto) {}


export type TCyclistProfileCreate = Prisma.CyclistProfileCreateInput;
export type TCyclistProfileUpdate = Prisma.CyclistProfileUpdateInput;
export type TCyclistProfileUniqueId = { id: string };
export type TCyclistProfileWhere = Prisma.CyclistProfileWhereInput;

