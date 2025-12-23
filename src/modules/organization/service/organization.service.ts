import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrganizationRepository } from '../repository/organization.repository';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../interface/organization.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';
import { PrismaService } from 'src/shared/service/prisma.service';
import { EntityNotFoundException } from 'src/shared/error';
import { randomBytes } from 'crypto';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly repository: OrganizationRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly prisma: PrismaService
  ) { }

  async create(createDto: CreateOrganizationDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'organization:pre:create',
      new DomainEvent({
        entityName: 'Organization',
        action: 'pre:create',
        payload: createDto,
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.create({
      name: createDto.name,
      slug: createDto.slug,
      description: createDto.description,
    });

    // 3. Post-Event
    this.eventEmitter.emit(
      'organization:post:create',
      new DomainEvent({
        entityName: 'Organization',
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

  async update(id: string, updateDto: UpdateOrganizationDto) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'organization:pre:update',
      new DomainEvent({
        entityName: 'Organization',
        action: 'pre:update',
        payload: { id, ...updateDto },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.update(id, updateDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'organization:post:update',
      new DomainEvent({
        entityName: 'Organization',
        action: 'post:update',
        payload: result,
      }),
    );

    return result;
  }

  async remove(id: string) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'organization:pre:delete',
      new DomainEvent({
        entityName: 'Organization',
        action: 'pre:delete',
        payload: { id },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.remove(id);

    // 3. Post-Event
    this.eventEmitter.emit(
      'organization:post:delete',
      new DomainEvent({
        entityName: 'Organization',
        action: 'post:delete',
        payload: result,
      }),
    );

    return result;
  }

  //

  // --- 1. OBTENER INFO PÚBLICA POR SLUG ---
  async getPublicInfoBySlug(slug: string) {
    const org = await this.prisma.organization.findUnique({
      where: { slug: slug }, // <--- BUSCAMOS POR SLUG
      include: {
        _count: { select: { members: true } }
      }
    });

    if (!org) {
      throw new NotFoundException('Organización no encontrada');
    }

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      description: org.description,
      logoUrl: org.logoUrl,
      membersCount: org._count.members,
      status: 'ACTIVE' // O org.status
    };
  }

  // --- 2. UNIRSE POR SLUG ---
  async joinBySlug(userId: string, slug: string) {
    // a. Buscar la Org por SLUG
    const org = await this.prisma.organization.findUnique({
      where: { slug: slug } // <--- BUSCAMOS POR SLUG
    });

    if (!org) throw new NotFoundException('Organización no encontrada');

    // b. Verificar si ya es miembro
    const existing = await this.prisma.organizationMember.findFirst({ // O 'organizationMember' según tu schema
      where: {
        organizationId: org.id,
        userId: userId
      }
    });

    if (existing) throw new ConflictException('Ya eres miembro de esta organización');

    // c. Crear miembro
    await this.prisma.organizationMember.create({ // O 'organizationMember'
      data: {
        userId,
        organizationId: org.id,
        role: 'MEMBER'
      }
    });

    return { success: true, orgName: org.name };
  }

  async findByOwner(userId: string) {
    // Buscamos una org donde este usuario sea miembro con rol administrativo
    // Asumiendo que existe la relación 'memberships' en User o 'members' en Organization
    return this.prisma.organization.findFirst({
      where: {
        members: {
          some: {
            userId: userId,
            // Ajusta los roles según tu enum OrgRole (ej: OWNER, ADMIN)
            role: { in: ['OWNER', 'ADMIN'] }
          }
        }
      },
      include: {
        members: true // Opcional: traer miembros
      }
    });
  }
}
