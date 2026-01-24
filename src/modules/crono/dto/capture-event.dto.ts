// capture-event.dto.ts
import { IsEnum, IsISO8601, IsOptional, IsString, IsUUID, IsObject, IsNumber } from 'class-validator';

export class CaptureEventDto {
    @IsUUID()
    id: string;

    @IsUUID()
    raceId: string;

    @IsUUID()
    participantId: string;

    @IsEnum(['START', 'LAP', 'CHECKPOINT', 'FINISH'])
    type: 'START' | 'LAP' | 'CHECKPOINT' | 'FINISH';

    @IsISO8601()
    timestamp: string;

    @IsOptional()
    @IsString()
    deviceUuid?: string;

    @IsNumber()
    @IsOptional()
    lapTime: number;
  
    @IsNumber()
    @IsOptional()
    totalAccumulatedTime: number;

    // --- NUEVO CAMPO PARA RECIBIR LA TELEMETRÍA ---
    @IsOptional()
    @IsObject()
    metadata?: {
        lapTime?: number;
        totalAccumulatedTime?: number;
    };
}