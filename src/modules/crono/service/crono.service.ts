import { Injectable } from "@nestjs/common";
import { RaceConfig } from "../interface/leaderboard-view.interface";

@Injectable()
export class CronoService {

    calculateLeaderboard(participants: any[], race: RaceConfig) {
        const totalRaceLaps = race.laps || 1;

        const standings = participants.map(p => {
            const lastEvent = p.events[0]; // El último evento 'LAP' sincronizado
            const lapsCompleted = p._count.events; // Conteo real de la base de datos

            return {
                participantId: p.id,
                bibNumber: p.bibNumber,
                fullName: p.profile.user.fullName,
                lapsCompleted: lapsCompleted,
                totalLaps: totalRaceLaps,
                // Usamos la telemetría que el móvil calculó y sincronizó
                totalTime: lastEvent?.totalAccumulatedTime || 0,
                lastLapTime: lastEvent?.lapTime || 0,
                isFinished: lapsCompleted >= totalRaceLaps,
            };
        });

        return standings.sort((a, b) => {
            // 1. Más vueltas ganan
            if (b.lapsCompleted !== a.lapsCompleted) return b.lapsCompleted - a.lapsCompleted;
            // 2. A igual vuelta, menor tiempo acumulado gana
            return a.totalTime - b.totalTime;
        });
    }

}