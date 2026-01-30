import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CategoryRepository } from '../repository/category.repository';
import { CreateCategoryDto, TCategoryCreate, UpdateCategoryDto } from '../interface/category.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';
import { PrismaService } from 'src/shared/service/prisma.service';
import { connect } from 'http2';
import { LoggerService } from 'src/shared/logger/logger.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly repository: CategoryRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService
  ) { }

  async create(createDto: CreateCategoryDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'category:pre:create',
      new DomainEvent({
        entityName: 'Category',
        action: 'pre:create',
        payload: createDto,
      }),
    );

    const objectToCreate: TCategoryCreate = {
      name: createDto.name,
      minAge: createDto.minAge,
      maxAge: createDto.maxAge,
      gender: createDto.gender,
    };

    // 2. Repository Logic
    const result = await this.repository.create(createDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'category:post:create',
      new DomainEvent({
        entityName: 'Category',
        action: 'post:create',
        payload: result,
      }),
    );

    return result;
  }

  async findAll(params?: any) {
    return this.repository.findAll(params);
  }

  async findOne(id: string) {
    return this.repository.findOne(id);
  }

  async update(id: string, updateDto: UpdateCategoryDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'category:pre:update',
      new DomainEvent({
        entityName: 'Category',
        action: 'pre:update',
        payload: { id, ...updateDto },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.update(id, updateDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'category:post:update',
      new DomainEvent({
        entityName: 'Category',
        action: 'post:update',
        payload: result,
      }),
    );

    return result;
  }

  async remove(id: string) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'category:pre:delete',
      new DomainEvent({
        entityName: 'Category',
        action: 'pre:delete',
        payload: { id },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.remove(id);

    // 3. Post-Event
    this.eventEmitter.emit(
      'category:post:delete',
      new DomainEvent({
        entityName: 'Category',
        action: 'post:delete',
        payload: result,
      }),
    );

    return result;
  }

  async migrateCategory() {
    // const categories = await this.prisma.category.findMany();

    const objectResposne: any[] = [];

    this.logger.logInfo('Migrating categories');

    const profiles = await this.prisma.cyclistProfile.findMany({
      include: {
        categories: true
      }
    });

    objectResposne.push(profiles);

    this.logger.logInfo(`Perfiles: ${profiles.length}`);

    const categoryPromises: any = [];

    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i];

      if (!profile.categoryId) return;

      const categoryId = profile.categoryId;

      this.logger.logInfo(`Perfil: ${profile.id} Category: ${categoryId}`);

      categoryPromises.push(
        this.prisma.cyclistProfileCategory.create({
          data: {
            category: { connect: { id: categoryId } },
            cyclistProfile: { connect: { id: profile.id } }
          }
        })
      )
    }

    const response = await Promise.all(categoryPromises);
    console.log(response);
    this.logger.logInfo('Migration complete');
    return objectResposne;
  }
}
