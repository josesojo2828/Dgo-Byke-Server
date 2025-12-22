
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
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    imports: [UserModule],
    controllers: [IamController],
    providers: [
        IamService,
        IamRepository,
        PrismaService,
        JwtService
    ],
    exports: [IamService]
})
export class IamModule { }
