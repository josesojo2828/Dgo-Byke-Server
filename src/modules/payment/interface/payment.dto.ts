import { Prisma } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';

import { IsString, IsDecimal, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class CreatePaymentDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  raceId: string;

  @IsDecimal()
  amount: number; // Prisma handles Decimal, but DTO often receives string/number. 
  // Note: IsDecimal checks for string representation of decimal usually.
  // For simplicity assuming number or string.

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @IsOptional()
  @IsString()
  transactionId?: string;
}

export type TPaymentCreate = Prisma.PaymentCreateInput;
export type TPaymentUpdate = Prisma.PaymentUpdateInput;
export type TPaymentUniqueId = { id: string };
export type TPaymentWhere = Prisma.PaymentWhereInput;
