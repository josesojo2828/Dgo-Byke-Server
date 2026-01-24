// src/modules/crono/usecase/get-live-standings.usecase.ts
import { Injectable } from "@nestjs/common";
import { CronoRepository } from "../repository/crono.repository";
import { CronoService } from "../service/crono.service";

@Injectable()
export class GetLiveStandingsUseCase {
    constructor(
        private readonly repository: CronoRepository,
        private readonly service: CronoService
    ) { }

    async execute(raceId: string) {
        // 1. Obtener configuración
        const race = await this.repository.getRaceConfig(raceId);
        if (!race) return [];

        // 2. Obtener participantes con telemetría de RaceEvent
        const participants = await this.repository.getParticipantsWithTimings(raceId);

        // 3. Calcular ranking usando la lógica del servicio
        return await this.service.calculateLeaderboard(participants, race);
    }
}