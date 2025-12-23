import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { CreateUserDto, UpdateUserDto, TUserWhere, TUserUniqueId, TUserUpdate, TUserCreate } from '../interface/user.dto';
import { TUserDetailInclude } from 'src/shared/types/prisma.types';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: TUserCreate) {
    return this.prisma.user.create({ data });
  }

  // Creación Transaccional: Crea el User y la entrada en UserRole al mismo tiempo
  async createWithRole(userData: any, roleId: string) {
    return this.prisma.user.create({
      data: {
        ...userData,
        roles: {
          create: {
            roleId: roleId // Aquí prisma llena la tabla pivote 'UserRole'
          }
        }
      },
      include: {
        roles: { // Devolvemos el rol para confirmar
          include: { role: true }
        }
      }
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: TUserUniqueId;
    where?: TUserWhere;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where: { ...where, deletedAt: null },
      orderBy,
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id }, include: TUserDetailInclude });
  }

  async findToken(tk: string) {
    return this.prisma.user.findUnique({ where: { token: tk }, include: TUserDetailInclude });
  }


  async findUnique(where: TUserUniqueId) {
    return this.prisma.user.findUnique({
      where: { ...where, deletedAt: null },
      include: {
        payments: true,
        roles: {
          include: { role: true }
        }
      }
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email }, include: TUserDetailInclude });
  }

  async update(id: string, data: TUserUpdate) {
    return this.prisma.user.update({ where: { id }, data, include: TUserDetailInclude });
  }

  async remove(id: string) {
    return this.prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async count(where?: TUserWhere) {
    return this.prisma.user.count({ where: { ...where, deletedAt: null } });
  }

  async findWithPermissions(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }
}
