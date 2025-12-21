
import { OrgRole, Prisma } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';

export class CreateOrganizationMemberDto {
    userId: string;
    organizationId: string;
    position?: string;
    role?: OrgRole;
}

export class UpdateOrganizationMemberDto {
    position?: string;
    role?: OrgRole;
    isActive?: boolean;
}

export type TOrganizationMemberCreate = Prisma.OrganizationMemberCreateInput;
export type TOrganizationMemberUpdate = Prisma.OrganizationMemberUpdateInput;
export type TOrganizationMemberUniqueId = { id: string };
export type TOrganizationMemberWhere = Prisma.OrganizationMemberWhereInput;
