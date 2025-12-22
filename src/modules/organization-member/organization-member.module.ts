
/**
 * Organization Member Module
 * Responsabilidad: Gestionar la membresía de usuarios en organizaciones (invitaciones, cargos, roles internos).
 * Ej. Asignar al usuario X como 'Presidente' del club.
 */
import { Module } from '@nestjs/common';
import { OrganizationMemberService } from './service/organization-member.service';
import { OrganizationMemberController } from './controller/organization-member.controller';
import { OrganizationMemberRepository } from './repository/organization-member.repository';
import { PrismaService } from 'src/shared/service/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    imports: [UserModule],
    controllers: [OrganizationMemberController],
    providers: [
        OrganizationMemberService,
        OrganizationMemberRepository,
        PrismaService,
        JwtService
    ],
    exports: [OrganizationMemberService]
})
export class OrganizationMemberModule { }
