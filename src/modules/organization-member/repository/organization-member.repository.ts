
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { CreateOrganizationMemberDto, UpdateOrganizationMemberDto, TOrganizationMemberWhere, TOrganizationMemberUniqueId } from '../interface/organization-member.dto';

@Injectable()
export class OrganizationMemberRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateOrganizationMemberDto) {
        return this.prisma.organizationMember.create({ data });
    }

    async findAll(params?: {
        skip?: number;
        take?: number;
        cursor?: TOrganizationMemberUniqueId;
        where?: TOrganizationMemberWhere;
        orderBy?: Prisma.OrganizationMemberOrderByWithRelationInput;
    }) {
        const { skip, take, cursor, where, orderBy } = params || {};
        return this.prisma.organizationMember.findMany({
            skip,
            take,
            cursor,
            where: { ...where, deletedAt: null },
            orderBy,
        });
    }

    async findOne(id: string) {
        return this.prisma.organizationMember.findUnique({ where: { id } });
    }

    async findUnique(where: TOrganizationMemberUniqueId) {
        return this.prisma.organizationMember.findUnique({ where });
    }

    async findByUserAndOrg(userId: string, organizationId: string) {
        return this.prisma.organizationMember.findUnique({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId,
                },
            },
        });
    }

    async update(id: string, data: UpdateOrganizationMemberDto) {
        return this.prisma.organizationMember.update({ where: { id }, data });
    }

    async remove(id: string) {
        return this.prisma.organizationMember.update({ where: { id }, data: { deletedAt: new Date() } });
    }

    async count(where?: Prisma.OrganizationMemberWhereInput) {
        return this.prisma.organizationMember.count({ where: { ...where, deletedAt: null } });
    }
}
