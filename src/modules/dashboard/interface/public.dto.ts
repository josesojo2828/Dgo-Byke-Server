import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { RaceType } from 'src/shared/types/system.type';

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

    // --- NUEVOS FILTROS ---
    @IsOptional()
    @IsString()
    search?: string; // Para buscar por nombre de carrera

    @IsOptional()
    @IsEnum(RaceType)
    type?: RaceType; // Para filtrar: MTB, RUTA, etc
}