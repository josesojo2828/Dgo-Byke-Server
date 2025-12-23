
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrganizationMemberRepository } from '../repository/organization-member.repository';
import { CreateOrganizationMemberDto, UpdateOrganizationMemberDto } from '../interface/organization-member.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';
import { PrismaService } from 'src/shared/service/prisma.service';

@Injectable()
export class OrganizationMemberService {
    constructor(
        private readonly repository: OrganizationMemberRepository,
        private readonly eventEmitter: EventEmitter2,
        private readonly prisma: PrismaService
    ) { }

    // Método específico para la vista del Organizador
    async findAllByOrganizer(userId: string, search?: string) {
        // 1. Identificar la organización del usuario logueado
        const membership = await this.prisma.organizationMember.findFirst({
            where: {
                userId,
                role: { in: ['OWNER', 'ADMIN'] }
            }
        });

        if (!membership) {
            throw new ForbiddenException('No tienes una organización asociada.');
        }

        // 2. Construir filtro de búsqueda si existe
        const where: any = {
            organizationId: membership.organizationId,
            deletedAt: null
        };

        if (search) {
            where.user = {
                OR: [
                    { fullName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ]
            };
        }

        // 3. Consultar miembros incluyendo datos del usuario
        return this.repository.findAll({
            where,
            orderBy: { createdAt: 'desc' }
        });
    }

    async create(createDto: CreateOrganizationMemberDto) {
        // Validate duplicates
        const existing = await this.repository.findByUserAndOrg(
            createDto.userId,
            createDto.organizationId,
        );

        if (existing) {
            throw new BadRequestException('User is already a member of this organization');
        }

        // 1. Pre-Event
        this.eventEmitter.emit(
            'organization-member:pre:create',
            new DomainEvent({
                entityName: 'OrganizationMember',
                action: 'pre:create',
                payload: createDto,
            }),
        );

        // 2. Repository Logic
        const result = await this.repository.create(createDto);

        // 3. Post-Event
        this.eventEmitter.emit(
            'organization-member:post:create',
            new DomainEvent({
                entityName: 'OrganizationMember',
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

    async update(id: string, updateDto: UpdateOrganizationMemberDto) {
        // 1. Pre-Event
        this.eventEmitter.emit(
            'organization-member:pre:update',
            new DomainEvent({
                entityName: 'OrganizationMember',
                action: 'pre:update',
                payload: { id, ...updateDto },
            }),
        );

        // 2. Repository Logic
        const result = await this.repository.update(id, updateDto);

        // 3. Post-Event
        this.eventEmitter.emit(
            'organization-member:post:update',
            new DomainEvent({
                entityName: 'OrganizationMember',
                action: 'post:update',
                payload: result,
            }),
        );

        return result;
    }

    async remove(id: string) {
        // 1. Pre-Event
        this.eventEmitter.emit(
            'organization-member:pre:delete',
            new DomainEvent({
                entityName: 'OrganizationMember',
                action: 'pre:delete',
                payload: { id },
            }),
        );

        // 2. Repository Logic
        const result = await this.repository.remove(id);

        // 3. Post-Event
        this.eventEmitter.emit(
            'organization-member:post:delete',
            new DomainEvent({
                entityName: 'OrganizationMember',
                action: 'post:delete',
                payload: result,
            }),
        );

        return result;
    }
}
