import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/service/prisma.service';

@Injectable()
export class LogisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    // 1. Ejecutar consultas en paralelo para velocidad
    const [
        tracksCount,
        categoriesCount,
        activeRacesCount,
        tracksWithData
    ] = await Promise.all([
        // KPI 1: Rutas Activas
        this.prisma.track.count({ where: { deletedAt: null } }),
        
        // KPI 3: Categorías
        this.prisma.category.count({ where: { deletedAt: null } }),
        
        // KPI 4: Eventos en Curso (Status OPEN o IN_PROGRESS)
        this.prisma.race.count({ 
            where: { 
                status: { in: ['PROGRAMADA', 'EN_CURSO'] },
                deletedAt: null 
            } 
        }),

        // Datos para el Mapa y conteo de Checkpoints
        this.prisma.track.findMany({
            where: { deletedAt: null },
            select: {
                id: true,
                name: true,
                geoData: true, // Array de coordenadas [lat, lng]
                checkpoints: true, // Array de checkpoints
            },
            take: 20 // Limitamos a las últimas 20 para no explotar el mapa visual
        })
    ]);

    // KPI 2: Calcular total de puntos de control sumando los de cada ruta
    // (Asumiendo que checkpoints es un JSON field en Track)
    const totalCheckpoints = tracksWithData.reduce((acc, track) => {
        const cp = track.checkpoints as any[]; 
        return acc + (cp?.length || 0);
    }, 0);

    return {
        metrics: {
            tracksCount,
            categoriesCount,
            activeRacesCount,
            checkpointsCount: totalCheckpoints
        },
        // Enviamos data simplificada para el mapa global
        mapData: tracksWithData.map(t => ({
            id: t.id,
            name: t.name,
            path: t.geoData, // La línea polilínea
            // Solo mandamos el primer punto para centrar o poner un marcador, no todos los checkpoints
            startPoint: (t.geoData as any[])?.[0] || null 
        }))
    };
  }
}