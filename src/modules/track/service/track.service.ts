import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TrackRepository } from '../repository/track.repository';
import { CreateTrackDto, TTrackCreate, TTrackUpdate, UpdateTrackDto } from '../interface/track.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';
import { User } from 'src/shared/types/system.type';
import { PrismaService } from 'src/shared/service/prisma.service';
import { BusinessLogicException } from 'src/shared/error';

@Injectable()
export class TrackService {
  constructor(
    private readonly repository: TrackRepository,
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async create(createDto: CreateTrackDto, userSession: User) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'track:pre:create',
      new DomainEvent({
        entityName: 'Track',
        action: 'pre:create',
        payload: createDto,
      }),
    );

    const orgId = await this.prisma.organization.findFirst({ where: { members: { some: { userId: userSession.id } } } });

    if (!orgId) {
      throw new BusinessLogicException('Debes pertenecer a una organización para crear un track');
    }

    const createObject: TTrackCreate = {
      distanceKm: createDto.distanceKm,
      elevationGain: createDto.elevationGain,
      name: createDto.name,
      description: createDto.description || '',
      latitude: createDto.latitude,
      longitude: createDto.longitude,
      geoData: [],
      organization: { connect: { id: orgId.id } },
    }

    // 2. Repository Logic
    const result = await this.repository.create(createObject);

    // 3. Post-Event
    this.eventEmitter.emit(
      'track:post:create',
      new DomainEvent({
        entityName: 'Track',
        action: 'post:create',
        payload: result,
      }),
    );

    return result;
  }

  async findAll(params?: any) {
    const result = await this.repository.findAll(params);
    return result;
  }

  async findOne(id: string) {
    return this.repository.findOne(id);
  }

  async update(id: string, updateDto: UpdateTrackDto) {
    const { checkpoints, geoData, ...rest } = updateDto;

    // 2. Preparamos la data base para actualizar el Track
    const updateData: TTrackUpdate = {
      ...rest,
    };

    // Si viene geoData, lo asignamos
    if (geoData) {
      updateData.geoData = geoData;
    }

    // 3. LÓGICA DE TRANSACCIÓN
    // Usamos el prisma client directo del repositorio (asegúrate de tener acceso público o crea un método transaction en el repo)
    // Asumiremos que repository.prisma es accesible. Si no, mueve esta lógica al repository.

    return this.prisma.$transaction(async (tx) => {

      // A. Actualizar el Track (Nombre, GeoData, Distancia, etc.)
      const updatedTrack = await tx.track.update({
        where: { id },
        data: updateData,
      });

      if (checkpoints && Array.isArray(checkpoints)) {

        // B1. Borrar checkpoints anteriores de este track (Limpieza) 
        await tx.checkpoint.deleteMany({
          where: { trackId: id }
        });

        // B2. Preparar los nuevos checkpoints
        // Mapeamos el array del frontend al formato de la BD
        const checkpointsToCreate = checkpoints.map((cp, index) => ({
          trackId: id,
          name: cp.name,
          latitude: cp.lat,   // Frontend manda 'lat' -> BD usa 'latitude'
          longitude: cp.lng,  // Frontend manda 'lng' -> BD usa 'longitude'
          order: index,       // Usamos el índice del array como orden
          isStart: cp.type === 'START',   // Conversión de lógica
          isFinish: cp.type === 'FINISH'
        }));

        // B3. Insertar masivamente
        if (checkpointsToCreate.length > 0) {
          await tx.checkpoint.createMany({
            data: checkpointsToCreate
          });
        }
      }

      return updatedTrack;
    });
  }

  async remove(id: string) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'track:pre:delete',
      new DomainEvent({
        entityName: 'Track',
        action: 'pre:delete',
        payload: { id },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.remove(id);

    // 3. Post-Event
    this.eventEmitter.emit(
      'track:post:delete',
      new DomainEvent({
        entityName: 'Track',
        action: 'post:delete',
        payload: result,
      }),
    );

    return result;
  }
}
