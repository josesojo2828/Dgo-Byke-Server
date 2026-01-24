// src/public/dto/pagination.dto.ts
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
// IMPORTANTE: Importa el Enum generado por Prisma
import { RaceType } from '@prisma/client';

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    // Class-validator usará el Enum oficial para validar el 400
    @IsEnum(RaceType)
    type?: RaceType;
}
