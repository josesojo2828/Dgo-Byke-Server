import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { CreateUserDto, UpdateUserDto, TUserWhere, TUserUniqueId } from '../interface/user.dto';
import { TUserDetailInclude } from 'src/shared/types/prisma.types';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateUserDto) {
    return this.prisma.user.create({ data });
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
      where,
      orderBy,
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id }, include: TUserDetailInclude });
  }

  async findUnique(where: TUserUniqueId) {
    return this.prisma.user.findUnique({
      where,
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

  async update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data, include: TUserDetailInclude });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async count(where?: TUserWhere) {
    return this.prisma.user.count({ where });
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
