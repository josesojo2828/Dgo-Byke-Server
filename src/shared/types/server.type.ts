import { FastifyRequest } from 'fastify';
import { User } from './schema.types';
// import { User } from '@prisma/client'; 
import { IsOptional, IsString, IsInt, Min, IsIn, IsDateString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export interface RequestWithUser extends FastifyRequest {
  user: User;
  lang: string
}

export class FilterParamsDto {
  // ==========================================
  // 1. CAMPOS DE BÚSQUEDA GENERAL
  // ==========================================
  @IsOptional()
  @IsString()
  q?: string; // Búsqueda global (nombre, email, ref, etc.)

  @IsOptional()
  @IsString()
  status?: string; // UserStatus, SubscriptionStatus, TransactionStatus

  // ==========================================
  // 2. FILTROS POR RELACIONES (IDs)
  // ==========================================
  
  @IsOptional()
  @IsString()
  permitId?: string; // Para filtrar Usuarios por Rol

  @IsOptional()
  @IsString()
  planId?: string; // Para filtrar Suscripciones por Plan

  @IsOptional()
  @IsString()
  paymentMethodId?: string; // Para UserPaymentMethod o Transactions

  @IsOptional()
  @IsString()
  userId?: string; // Útil si un admin quiere ver transacciones de un usuario X

  // ==========================================
  // 3. FILTROS DE CLASIFICACIÓN
  // ==========================================

  @IsOptional()
  @IsString()
  type?: string; // TransactionType, AddressType

  @IsOptional()
  @IsString()
  currency?: string; // UserWallet, SubscriptionPlan

  @IsOptional()
  @IsString()
  country?: string; // UserAddress

  // ==========================================
  // 4. FILTROS BOOLEANOS
  // ==========================================
  // Nota: Los query params siempre llegan como string ('true'). 
  // Transform convierte 'true' string a boolean real.

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  autoRenew?: boolean; // Subscription

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  active?: boolean; // PaymentMethods

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  selected?: boolean; // SubscriptionPlan visible

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isDefault?: boolean; // UserAddress, UserPaymentMethod

  // ==========================================
  // 5. RANGOS DE FECHAS
  // ==========================================

  @IsOptional()
  @IsDateString()
  createdAt_gte?: string;

  @IsOptional()
  @IsDateString()
  createdAt_lte?: string;

  @IsOptional()
  @IsDateString()
  updatedAt_gte?: string;

  @IsOptional()
  @IsDateString()
  updatedAt_lte?: string;

  // ==========================================
  // 6. PAGINACIÓN Y ORDENAMIENTO
  // ==========================================

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
