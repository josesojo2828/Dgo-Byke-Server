
/**
 * IAM Module (Identity Access Management)
 * Responsabilidad: Gestionar Roles, Permisos y asignaciones de seguridad (RBAC).
 * Ej. Crear el rol 'Juez' con permiso de 'race.finish'.
 */
import { Module } from '@nestjs/common';
import { IamService } from './service/iam.service';
import { IamController } from './controller/iam.controller';
import { IamRepository } from './repository/iam.repository';
import { PrismaService } from 'src/shared/service/prisma.service';

@Module({
    controllers: [IamController],
    providers: [
        IamService,
        IamRepository,
        PrismaService
    ],
    exports: [IamService]
})
export class IamModule { }
