import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}

export class RegisterDto {
    @IsString()
    @MinLength(3)
    fullName: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    // @MinLength(6)
    password?: string;

    @IsOptional()
    @IsString()
    organization?: string

    @IsOptional()
    @IsString()
    category?: string
}

export interface IJwtPayload {
    sub: string;
    email: string;
}
