import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/modules/user/service/user.service';

@Injectable()
export class SessionAuthGuard implements CanActivate {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService, // 1. Inyectamos JwtService
        private readonly reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest<FastifyRequest>();
        const response = context.switchToHttp().getResponse<FastifyReply>();

        // ---------------------------------------------------------
        // ESTRATEGIA A: ¿Es una petición API con Token? (Bearer)
        // ---------------------------------------------------------
        const authHeader = request.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];

            try {
                const user = await this.usersService.findByToken(`${token}`);
                if (!user) throw new UnauthorizedException();

                (request as any).user = user;
                return true; // ✅ Acceso concedido vía JWT
            } catch (error) {
                // Si hay token pero es inválido, lanzamos 401 directo (es una API)
                throw new UnauthorizedException('Token inválido o expirado');
            }
        }
        return false;
    }
}