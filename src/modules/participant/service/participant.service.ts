import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ParticipantRepository } from '../repository/participant.repository';
import { CreateParticipantDto, TRaceParticipantCreate, TRaceParticipantWhere, UpdateParticipantDto } from '../interface/participant.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';
import { UserService } from 'src/modules/user/service/user.service';
import { BusinessLogicException } from 'src/shared/error';

@Injectable()
export class ParticipantService {
  constructor(
    private readonly repository: ParticipantRepository,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async create(createDto: CreateParticipantDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'participant:pre:create',
      new DomainEvent({
        entityName: 'Participant',
        action: 'pre:create',
        payload: createDto,
      }),
    );

    // verificar si el ciclista ya tiene un perfil
    const profile = await this.userService.findOne(createDto.profileId);
    if (!profile || !profile.cyclistProfile) throw new BusinessLogicException('Debes crear un perfil de ciclista primero');

    const dataToCreate: TRaceParticipantCreate = {
      profile: { connect: { id: profile.cyclistProfile.id } },
      race: { connect: { id: createDto.raceId } },
    };

    // 2. Repository Logic
    const result = await this.repository.create(dataToCreate);

    // 3. Post-Event
    this.eventEmitter.emit(
      'participant:post:create',
      new DomainEvent({
        entityName: 'Participant',
        action: 'post:create',
        payload: result,
      }),
    );

    return result;
  }

  async findAll(params?: any) {
    const where: TRaceParticipantWhere[] = [];


    if (params?.raceId) {
      where.push({ raceId: params.raceId });
    }

    return this.repository.findAll({ 
      where: where.length > 0 ? { OR: where } : undefined,
    });
  }

  async findOne(id: string) {
    return this.repository.findOne(id);
  }

  async update(id: string, updateDto: UpdateParticipantDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'participant:pre:update',
      new DomainEvent({
        entityName: 'Participant',
        action: 'pre:update',
        payload: { id, ...updateDto },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.update(id, updateDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'participant:post:update',
      new DomainEvent({
        entityName: 'Participant',
        action: 'post:update',
        payload: result,
      }),
    );

    return result;
  }

  async remove(id: string) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'participant:pre:delete',
      new DomainEvent({
        entityName: 'Participant',
        action: 'pre:delete',
        payload: { id },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.remove(id);

    // 3. Post-Event
    this.eventEmitter.emit(
      'participant:post:delete',
      new DomainEvent({
        entityName: 'Participant',
        action: 'post:delete',
        payload: result,
      }),
    );

    return result;
  }
}
