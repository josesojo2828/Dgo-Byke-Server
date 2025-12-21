import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/service/prisma.service';
import { CreatePaymentDto, UpdatePaymentDto } from '../interface/payment.dto';

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
      where,
      orderBy,
    });
  }

  async findOne(id: string) {
    return this.prisma.payment.findUnique({ where: { id } });
  }

  async findUnique(where: Prisma.PaymentWhereUniqueInput) {
    return this.prisma.payment.findUnique({ where });
  }

  async update(id: string, data: UpdatePaymentDto) {
    return this.prisma.payment.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.payment.delete({ where: { id } });
  }

  async count(where?: Prisma.PaymentWhereInput) {
    return this.prisma.payment.count({ where });
  }
}
