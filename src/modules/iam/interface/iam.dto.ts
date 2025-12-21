
import { Prisma } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';

export class CreateRoleDto {
    name: string;
    description?: string;
}

export class CreatePermissionDto {
    action: string;
    description?: string;
}

export class AssignPermissionDto {
    roleId: string;
    permissionId: string;
}

export class AssignRoleDto {
    userId: string;
    roleId: string;
}

export type TRoleCreate = Prisma.RoleCreateInput;
export type TRoleUpdate = Prisma.RoleUpdateInput;
export type TRoleUniqueId = { id: string };
export type TRoleWhere = Prisma.RoleWhereInput;

export type TPermissionCreate = Prisma.PermissionCreateInput;
export type TPermissionUpdate = Prisma.PermissionUpdateInput;
export type TPermissionUniqueId = { id: string };
export type TPermissionWhere = Prisma.PermissionWhereInput;
