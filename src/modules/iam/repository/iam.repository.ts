import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { CreateRoleDto, CreatePermissionDto, TRoleWhere, TRoleUniqueId, TPermissionWhere, TPermissionUniqueId, AssignPermissionDto, AssignRoleDto } from '../interface/iam.dto';

@Injectable()
export class IamRepository {
    constructor(private readonly prisma: PrismaService) { }

    // --- Roles ---
    async createRole(data: CreateRoleDto) {
        return this.prisma.role.create({ data });
    }

    async findAllRoles(params?: {
        skip?: number;
        take?: number;
        cursor?: TRoleUniqueId;
        where?: TRoleWhere;
        orderBy?: Prisma.RoleOrderByWithRelationInput;
    }) {
        const { skip, take, cursor, where, orderBy } = params || {};
        return this.prisma.role.findMany({
            skip,
            take,
            cursor,
            where: { ...where, deletedAt: null },
            orderBy,
            include: { permissions: true }
        });
    }

    async findRoleUnique(where: TRoleUniqueId) {
        return this.prisma.role.findUnique({ where });
    }

    async updateRole(id: string, data: any) { // Using any for partial updates or defined DTO
        return this.prisma.role.update({ where: { id }, data });
    }

    async deleteRole(id: string) {
        return this.prisma.role.update({ where: { id }, data: { deletedAt: new Date() } });
    }

    async countRoles(where?: TRoleWhere) {
        return this.prisma.role.count({ where: { ...where, deletedAt: null } });
    }

    // --- Permissions ---
    async createPermission(data: CreatePermissionDto) {
        return this.prisma.permission.create({ data });
    }

    async findAllPermissions(params?: {
        skip?: number;
        take?: number;
        cursor?: TPermissionUniqueId;
        where?: TPermissionWhere;
        orderBy?: Prisma.PermissionOrderByWithRelationInput;
    }) {
        const { skip, take, cursor, where, orderBy } = params || {};
        return this.prisma.permission.findMany({
            skip,
            take,
            cursor,
            where: { ...where, deletedAt: null },
            orderBy,
        });
    }

    async findPermissionUnique(where: TPermissionUniqueId) {
        return this.prisma.permission.findUnique({ where });
    }

    async countPermissions(where?: TPermissionWhere) {
        return this.prisma.permission.count({ where: { ...where, deletedAt: null } });
    }

    // --- Assignments ---
    async assignPermissionToRole(data: AssignPermissionDto) {
        return this.prisma.rolePermission.create({
            data: {
                roleId: data.roleId,
                permissionId: data.permissionId,
            },
        });
    }

    async assignRoleToUser(data: AssignRoleDto) {
        return this.prisma.userRole.create({
            data: {
                userId: data.userId,
                roleId: data.roleId,
            },
        });
    }
}
