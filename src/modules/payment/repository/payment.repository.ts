import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { CreatePaymentDto, UpdatePaymentDto } from '../interface/payment.dto';
import { TPaymentListInclude } from 'src/shared/types/prisma.types';

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreatePaymentDto) {
    return this.prisma.payment.create({ data });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PaymentWhereUniqueInput;
    where?: Prisma.PaymentWhereInput;
    orderBy?: Prisma.PaymentOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.payment.findMany({
      skip,
      take,
      cursor,
      include: TPaymentListInclude,
      where: { ...where, deletedAt: null },
      orderBy,
    });
  }

  async findOne(id: string) {
    return this.prisma.payment.findUnique({ where: { id },include: TPaymentListInclude });
  }

  async findUnique(where: Prisma.PaymentWhereUniqueInput) {
    return this.prisma.payment.findUnique({ where,include: TPaymentListInclude });
  }

  async update(id: string, data: UpdatePaymentDto) {
    return this.prisma.payment.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.payment.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async count(where?: Prisma.PaymentWhereInput) {
    return this.prisma.payment.count({ where: { ...where, deletedAt: null } });
  }
}
