import { Injectable, NotFoundException } from "@nestjs/common";
import { CronoRepository } from "../repository/crono.repository";
import { CronoService } from "../service/crono.service";
import { CronoGateway } from "../gateway/crono.gateway";
import { SyncBulkEventsDto } from "../dto/sync-bulk-events.dto";

@Injectable()
export class ProcessCaptureUseCase {
    constructor(
        private readonly repository: CronoRepository,
        private readonly service: CronoService,
        private readonly gateway: CronoGateway
    ) { }

    async execute(dto: SyncBulkEventsDto) {


        console.log(dto);

        // 1. Guardar
        await this.repository.saveEvents(dto.raceId, dto.events);

        // 2. Obtener config y validar
        const race = await this.repository.getRaceConfig(dto.raceId);
        if (!race) {
            throw new NotFoundException(`Carrera ${dto.raceId} no encontrada`);
        }

        // 3. Obtener participantes
        const participants = await this.repository.getParticipantsWithTimings(dto.raceId);

        // 4. Calcular (Aquí ya no dará error de 1 vs 2 argumentos)
        const leaderboard = this.service.calculateLeaderboard(participants, race);

        // 5. Notificar
        this.gateway.sendLeaderboardUpdate(dto.raceId, leaderboard);

        return leaderboard;
    }
}