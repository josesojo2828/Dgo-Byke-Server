import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/service/prisma.service";
import { CaptureEventDto } from "../dto/capture-event.dto";

@Injectable()
export class CronoRepository {
    constructor(private readonly prisma: PrismaService) { }

    // Obtener configuración básica de la carrera
    async getRaceConfig(raceId: string) {
        return this.prisma.race.findUnique({
            where: { id: raceId, deletedAt: null },
            select: {
                id: true,
                name: true,
                status: true,
                laps: true, // Importante para saber cuántas vueltas faltan
                type: true
            }
        });
    }

    // Guardar eventos crudos de forma masiva (Idempotente)
    async saveEvents(raceId: string, events: CaptureEventDto[]) {
        // Mapeamos los eventos asegurando que no truene si falta metadata
        const eventsData = events.map((ev) => ({
            id: ev.id,
            raceId: raceId,
            participantId: ev.participantId,
            type: ev.type,
            timestamp: new Date(ev.timestamp),
            deviceUuid: ev.deviceUuid,

            // Usamos el valor directo del DTO o el de metadata con seguridad
            lapTime: ev.lapTime ?? ev.metadata?.lapTime ?? null,
            totalAccumulatedTime: ev.totalAccumulatedTime ?? ev.metadata?.totalAccumulatedTime ?? null,

            // Guardamos el objeto metadata completo si existe
            metadata: ev.metadata ? (ev.metadata as any) : null,
        }));

        // Usamos un createMany con skipDuplicates para asegurar la idempotencia
        // (Requiere que 'id' sea la llave primaria en tu esquema de Prisma)
        return await this.prisma.raceEvent.createMany({
            data: eventsData,
            skipDuplicates: true,
        });
    }

    async getParticipantsWithTimings(raceId: string) {
        return this.prisma.raceParticipant.findMany({
            where: { raceId, deletedAt: null },
            include: {
                profile: {
                    include: { user: { select: { fullName: true } } }
                },
                // CAMBIO: Leer de RaceEvent, no de raceTimings
                events: {
                    where: { type: 'LAP' },
                    orderBy: { timestamp: 'desc' },
                    take: 1
                },
                _count: {
                    select: { events: { where: { type: 'LAP' } } }
                }
            }
        });
    }
}