import { Prisma } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCheckpointDto {
  // Definir propiedades
}

export class UpdateCheckpointDto {
  // Definir propiedades opcionales
}

export type TCheckpointCreate = Prisma.CheckpointCreateInput;
export type TCheckpointUpdate = Prisma.CheckpointUpdateInput;
export type TCheckpointUniqueId = { id: string };
export type TCheckpointWhere = Prisma.CheckpointWhereInput;
