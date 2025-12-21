import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/service/user.service';
import { IJwtPayload } from '../interface/auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'secretKey',
        });
    }

    async validate(payload: IJwtPayload) {
        // Here we load the full user with roles and permissions
        const user = await this.userService.findWithPermissions(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }

        // We explicitly fetch roles and permissions relationships
        // Since findOne in UserService calls findUnique, we might need to update repository to include relations
        // OR we just rely on `prisma.user.findUnique({ include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } } })`
        // But for now, let's assume standard user object, and we might need to enhance UserService.findOne loading.

        return user;
    }
}
