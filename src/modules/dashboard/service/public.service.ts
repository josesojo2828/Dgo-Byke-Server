import { Injectable, NotFoundException } from '@nestjs/common';
import { RaceStatus } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { PaginationDto } from '../interface/public.dto';
import { TRaceWhere } from 'src/modules/race/interface/race.dto';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) { }

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
  async getRaceRanking(raceId: String) {
    // Verificamos que la carrera exista
    const race = await this.prisma.race.findUnique({ where: { id: raceId as string } });
    if (!race) throw new NotFoundException('Carrera no encontrada');

    return this.prisma.raceParticipant.findMany({
      where: {
        raceId: raceId as string,
        // Opcional: Solo mostrar los que tienen tiempo final o status ok
        finalTime: { not: null },
      },
      orderBy: [
        { rank: 'asc' },       // Primero por posición
        { finalTime: 'asc' },  // Respaldo por tiempo
      ],
      select: {
        rank: true,
        finalTime: true,
        bibNumber: true,
        status: true,
        // Datos del ciclista (SIN password ni email)
        profile: {
          select: {
            teamName: true,
            user: {
              select: {
                fullName: true,
                avatarUrl: true,
                // country: true, // Si lo tuvieras
              },
            },
          },
        },
        // Qué bici usó
        bicycle: {
          select: { brand: true, model: true }
        }
      },
    });
  }

  async getPublicRaces(dto: PaginationDto) {
    const { page = 1, limit = 10, search, type } = dto;
    const skip = (page - 1) * limit;

    // Construimos el filtro dinámicamente
    const where: TRaceWhere = {
      status: { not: 'BORRADOR' },
      // Si hay búsqueda, busca en el nombre O en el lugar
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { locationName: { contains: search, mode: 'insensitive' } },
        ],
      }),
      // Si hay filtro de tipo
      ...(type && { type: type }),
    };

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
          organization: {
            select: { name: true, slug: true, logoUrl: true },
          },
          track: { // Agregamos info básica del track para la "card"
            select: { distanceKm: true, elevationGain: true }
          },
          categories: { select: { name: true } },
        },
      }),
    ]);

    return {
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      data,
    };
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