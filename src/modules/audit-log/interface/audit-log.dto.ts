import { Prisma } from "@prisma/client";
import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEnum, IsUUID, IsObject, IsOptional, IsIP } from 'class-validator';
import { AuditAction } from "src/shared/types/system.type";

export class CreateAuditLogDto {
  @IsEnum(AuditAction)
  action: AuditAction;

  @IsString()
  entity: string;

  @IsString()
  entityId: string;

  @IsOptional()
  @IsObject()
  oldData?: any;

  @IsOptional()
  @IsObject()
  newData?: any;

  @IsIP()
  ipAddress: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class UpdateAuditLogDto extends PartialType(CreateAuditLogDto) { }

export type TAuditLogCreate = Prisma.AuditLogCreateInput;
export type TAuditLogUpdate = Prisma.AuditLogUpdateInput;
export type TAuditLogUniqueId = { id: string };

