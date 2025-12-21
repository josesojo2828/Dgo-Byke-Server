import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/service/user.service';
import { LoginDto, IJwtPayload, RegisterDto } from './interface/auth.dto';
import * as bcrypt from 'bcrypt';
import { SystemRole } from 'src/shared/types/system.type';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload: IJwtPayload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
        };
    }

    async register(registerDto: RegisterDto) {
        // 1. Create User (UserService handles hashing now)
        const user = await this.userService.create({
            email: registerDto.email,
            password: registerDto.password,
            fullName: registerDto.fullName,
            isActive: true,
            // Force default role via Enum
            systemRole: SystemRole.CYCLIST
        } as any); // Type cast quite safe now

        // 2. Assign Default Role (USER/CYCLIST) via RBAC
        // We need to inject PrismaService or IamService to assign role.
        // For simplicity, let's assume we can use a helper or just return the user for now
        // Ideally: await this.iamService.assignRole...

        // Let's return the token immediately so they are logged in
        const payload: IJwtPayload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
            message: 'Registro exitoso'
        };
    }
}
