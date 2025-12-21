import { PartialType } from '@nestjs/mapped-types';
import { OrgRole, Prisma } from '@prisma/client';
import { IsString, IsEmail, MinLength, IsOptional, IsEnum, IsBoolean, IsUUID } from 'class-validator';
import { SystemRole } from 'src/shared/types/system.type';

export class CreateUserDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString({ message: 'El nombre completo es obligatorio' })
  @MinLength(3, { message: 'El nombre es muy corto' })
  fullName: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser texto' })
  phone?: string;

  @IsOptional()
  @IsEnum(SystemRole, { message: 'El rol de sistema no es válido' })
  systemRole?: SystemRole;
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

