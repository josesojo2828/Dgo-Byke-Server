import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RaceStatus } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { PaginationDto } from '../interface/public.dto';
import { TRaceWhere } from 'src/modules/race/interface/race.dto';
import { CronoRepository } from 'src/modules/crono/repository/crono.repository';
import { CronoService } from 'src/modules/crono/service/crono.service';

@Injectable()
export class PublicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cronoRepository: CronoRepository,
    private readonly cronoService: CronoService
  ) { }

  // 1. OBTENER EVENTOS (Carreras)
  // Filtramos para NO mostrar borradores ni canceladas si no quieres
  // async getPublicRaces(dto: PaginationDto) {
  //   const { page = 1, limit = 10 } = dto;
  //   const skip = (page - 1) * limit;

  //   const [total, data] = await Promise.all([
  //     this.prisma.race.count({
  //       where: {
  //         status: { not: 'BORRADOR' }, // Solo publicas
  //       },
  //     }),
  //     this.prisma.race.findMany({
  //       skip,
  //       take: limit,
  //       where: {
  //         status: { not: 'BORRADOR' },
  //       },
  //       orderBy: { date: 'asc' },
  //       select: {
  //         id: true,
  //         name: true,
  //         date: true,
  //         locationName: true,
  //         status: true,
  //         type: true,
  //         price: true,
  //         organization: {
  //           select: {
  //             name: true,
  //             slug: true,
  //             logoUrl: true,
  //           },
  //         },
  //         // Incluimos categorías básicas para info rápida
  //         categories: {
  //           select: { name: true },
  //         },
  //       },
  //     }),
  //   ]);

  //   console.log(total);

  //   return {
  //     meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  //     data,
  //   };
  // }

  // 2. OBTENER CATEGORÍAS
  async getCategories() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        minAge: true,
        maxAge: true,
        gender: true,
      },
    });
  }

  // 3. OBTENER RUTAS (Tracks)
  // Importante: Quizás no quieras enviar TODO el GeoJSON en la lista, pesa mucho.
  async getTracks(limitGeoData: boolean = true) {
    return this.prisma.track.findMany({
      select: {
        id: true,
        name: true,
        distanceKm: true,
        elevationGain: true,
        latitude: true,
        longitude: true,
        geoData: limitGeoData ? false : true, // Opcional: solo enviar detalle si se pide un ID específico
        checkpoints: {
          select: { name: true, order: true }
        }
      },
    });
  }

  // 4. RANKING DE UNA CARRERA
  async getRaceRanking(raceId: string) {
    // 1. Validar carrera
    const race = await this.prisma.race.findUnique({
      where: { id: raceId },
      // AÑADIMOS 'type: true' para satisfacer la interfaz RaceConfig
      select: {
        id: true,
        laps: true,
        name: true,
        date: true,
        type: true
      }
    });

    if (!race) throw new NotFoundException('Carrera no encontrada');

    // 2. Obtener los datos reales desde el repositorio de Crono
    const participants = await this.cronoRepository.getParticipantsWithTimings(raceId);

    // 3. Calcular el ranking usando el motor oficial
    // Ahora TypeScript validará correctamente el objeto 'race'
    return this.cronoService.calculateLeaderboard(participants, race);
  }

  async getPublicRaces(dto: PaginationDto) {
    const { page = 1, limit = 10, search, type } = dto;
    const skip = (page - 1) * limit;

    // Declaramos 'where' explícitamente con el tipo de Prisma
    const where: Prisma.RaceWhereInput = {
      status: { not: 'BORRADOR' }
    };

    // Asignación segura del tipo de carrera
    if (type) {
      where.type = type;
    }

    // Construcción del OR para búsqueda por texto
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        { locationName: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.race.count({ where }),
      this.prisma.race.findMany({
        skip,
        take: limit,
        where,
        orderBy: { date: 'asc' },
        select: {
          id: true,
          name: true,
          date: true,
          locationName: true,
          status: true,
          type: true,
          price: true,
          organization: { select: { name: true, slug: true, logoUrl: true } },
          track: { select: { distanceKm: true, elevationGain: true } },
          categories: { select: { name: true } },
        },
      }),
    ]);

    const entity = {
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      data,
    }

    console.log(entity); 

    return entity;
  }

  // NUEVO: OBTENER DETALLE DE UNA CARRERA (Para la ficha)
  async getRaceDetail(id: string) {
    const race = await this.prisma.race.findUnique({
      where: { id },
      include: {

        organization: {
          select: { name: true, description: true, logoUrl: true, slug: true }
        },
        track: true, // Traemos todo el track (incluyendo GeoJSON) para el mapa
        categories: true,
        _count: {
          select: { participants: true } // Contador de inscritos
        }
      }
    });

    if (!race || race.status === 'BORRADOR') {
      throw new NotFoundException('Carrera no encontrada o no disponible');
    }

    return race;
  }
}