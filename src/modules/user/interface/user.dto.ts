import { PartialType } from '@nestjs/mapped-types';
import { OrgRole, Prisma } from '@prisma/client';
import { IsString, IsEmail, MinLength, IsOptional, IsEnum, IsBoolean, IsUUID } from 'class-validator';
import { SystemRole } from 'src/shared/types/system.type';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsEmail({}, { message: 'El correo no es válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsUUID('4', { message: 'Debes seleccionar un rol válido' })
  roleId: string; // Recibimos el ID del rol para relacionarlo
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser verdadero o falso' })
  isActive?: boolean;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export type TUserCreate = Prisma.UserCreateInput;
export type TUserUpdate = Prisma.UserUpdateInput;
export type TUserUniqueId = { id: string };
export type TUserWhere = Prisma.UserWhereInput;

