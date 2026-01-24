import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus
} from '@nestjs/common';

import { ProcessCaptureUseCase } from '../usecase/process-capture.usecase';
import { GetLiveStandingsUseCase } from '../usecase/get-live-standings.usecase';

import { SyncBulkEventsDto } from '../dto/sync-bulk-events.dto';
import { CaptureEventDto } from '../dto/capture-event.dto';

@Controller('crono')
export class CronoController {
    constructor(
        private readonly processCaptureUseCase: ProcessCaptureUseCase,
        private readonly getLiveStandingsUseCase: GetLiveStandingsUseCase,
    ) { }

    /**
     * Sincronización masiva (Offline Sync)
     * Este endpoint recibe el array de eventos capturados sin internet.
     */
    @Post('sync')
    @HttpCode(HttpStatus.OK)
    async syncOfflineData(@Body() syncDto: SyncBulkEventsDto) {
        // Procesamos el lote de eventos y devolvemos el ranking actualizado
        return await this.processCaptureUseCase.execute(syncDto);
    }

    /**
     * Registro individual (Fallback)
     */
    @Post('capture')
    async captureSingleEvent(@Body() eventDto: CaptureEventDto) {
        // Ahora TypeScript reconoce eventDto.raceId
        return await this.processCaptureUseCase.execute({
            raceId: eventDto.raceId,
            events: [eventDto]
        });
    }

    /**
     * Obtener el Leaderboard actual
     * Consultar la tabla de posiciones en un momento específico.
     */
    @Get('leaderboard/:raceId')
    async getLeaderboard(@Param('raceId', ParseUUIDPipe) raceId: string) {
        return await this.getLiveStandingsUseCase.execute(raceId);
    }

    /**
     * Estado técnico de la carrera (Resumen)
     * Para ver cuántos han pasado por meta, cuántos faltan, etc.
     */
    @Get('status/:raceId')
    async getRaceCronoStatus(@Param('raceId', ParseUUIDPipe) raceId: string) {
        // Aquí podrías llamar a un método del service que devuelva métricas rápidas
        return {
            raceId,
            timestamp: new Date(),
            activeParticipants: 45, // Ejemplo
            lastEventSynced: '2026-01-14T18:00:00Z'
        };
    }
}