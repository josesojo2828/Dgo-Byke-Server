import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { CreateRaceDto, UpdateRaceDto, TRaceWhere, TRaceUniqueId } from '../interface/race.dto';
import { TRaceDetailInclude, TRaceListInclude } from 'src/shared/types/prisma.types';

@Injectable()
export class RaceRepository {
  constructor(private readonly prisma: PrismaService) { }

  async getDashboardMetrics() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const previousYear = currentYear - 1;

    // 1. Ejecutamos consultas en paralelo (Optimizadas)
    const [
      statsCounts, 
      racesCurrentYear, 
      racesPreviousYear,
      upcomingRaces
    ] = await Promise.all([
      // A. Conteos Rápidos (Total, En Vivo, Abiertas)
      this.prisma.$transaction([
        this.prisma.race.count({ where: { date: { gte: new Date(currentYear, 0, 1) }, deletedAt: null } }),
        this.prisma.race.count({ where: { status: 'EN_CURSO', deletedAt: null } }),
        this.prisma.race.count({ where: { status: 'PROGRAMADA', deletedAt: null } }),
      ]),
      
      // B. Data para Gráfico (Año Actual) - Traemos solo fecha y participantes
      this.prisma.race.findMany({
        where: { 
          date: { gte: new Date(currentYear, 0, 1), lte: new Date(currentYear, 11, 31) },
          deletedAt: null 
        },
        select: { date: true, _count: { select: { participants: true } }, price: true }
      }),

      // C. Data para Gráfico (Año Pasado)
      this.prisma.race.findMany({
        where: { 
          date: { gte: new Date(previousYear, 0, 1), lte: new Date(previousYear, 11, 31) },
          deletedAt: null 
        },
        select: { date: true, _count: { select: { participants: true } } }
      }),

      // D. Próximos Eventos
      this.prisma.race.findMany({
        where: { date: { gte: now }, deletedAt: null },
        orderBy: { date: 'asc' },
        take: 5,
        select: { id: true, name: true, date: true, status: true }
      })
    ]);

    // 2. Procesamiento de Datos para el Gráfico
    // Inicializamos array de 12 meses
    const chartData = Array.from({ length: 12 }, (_, i) => ({
      monthIndex: i,
      current: 0,
      previous: 0
    }));

    // Llenamos Año Actual
    racesCurrentYear.forEach(race => {
      const month = new Date(race.date).getMonth(); // 0 = Enero
      chartData[month].current += race._count.participants;
    });

    // Llenamos Año Pasado
    racesPreviousYear.forEach(race => {
      const month = new Date(race.date).getMonth();
      chartData[month].previous += race._count.participants;
    });

    // Normalizamos para porcentaje (0-100) si quieres barras relativas, 
    // o enviamos valores absolutos y que el front decida.
    // Para este diseño, enviaremos VALORES ABSOLUTOS y calcularemos el max en el front.
    
    // Mapeo de meses a etiquetas (ENE, FEB...)
    const monthLabels = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const formattedChartData = chartData.map(d => ({
        label: monthLabels[d.monthIndex],
        current: d.current,
        previous: d.previous
    }));

    // 3. Cálculos Financieros
    const totalParticipants = racesCurrentYear.reduce((acc, curr) => acc + curr._count.participants, 0);
    const estimatedRevenue = racesCurrentYear.reduce((acc, curr) => acc + ((Number(curr.price) || 0) * curr._count.participants), 0);

    return {
      totalRaces: statsCounts[0],
      liveRaces: statsCounts[1],
      openRaces: statsCounts[2],
      upcomingRaces,
      totalParticipants,
      estimatedRevenue,
      registrationTrend: formattedChartData // <--- AQUÍ VA LA DATA NUEVA
    };
  }

  async createWithRelations(data: Prisma.RaceCreateInput) {
    return this.prisma.race.create({ data });
  }

  // Mantenemos el anterior por compatibilidad si se usa en otro lado
  async create(data: CreateRaceDto) {
    // ... lógica anterior
    return this.prisma.race.create({ data: data as any });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: TRaceUniqueId;
    where?: TRaceWhere;
    orderBy?: Prisma.RaceOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.race.findMany({
      skip,
      take,
      cursor,
      include: TRaceListInclude, // <--- CAMBIO CLAVE: Usamos el include ligero para listas
      where: { ...where, deletedAt: null },
      orderBy,
    });
  }

  async findOne(id: string) {
    // Para el detalle usamos el pesado
    return this.prisma.race.findUnique({ where: { id }, include: TRaceDetailInclude });
  }
  async findUnique(where: TRaceUniqueId) {
    return this.prisma.race.findUnique({ where, include: TRaceDetailInclude });
  }

  async update(id: string, data: UpdateRaceDto) {
    return this.prisma.race.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.race.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async count(where?: TRaceWhere) {
    return this.prisma.race.count({ where: { ...where, deletedAt: null } });
  }
}
