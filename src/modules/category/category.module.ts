/**
 * Category Module
 * Responsabilidad: Gestionar las categorías de competición (Master A, Elite, etc.) y sus reglas.
 * Ej. Crear la categoría 'Master A' para mayores de 30 años.
 */
import { Module } from '@nestjs/common';
import { CategoryService } from './service/category.service';
import { CategoryController } from './controller/category.controller';
import { CategoryRepository } from './repository/category.repository';
import { CategoryUseCase } from './usecase/category.usecase';
import { PrismaService } from 'src/shared/service/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepository,
    CategoryUseCase,
    PrismaService,
    JwtService
  ],
  exports: [CategoryService]
})
export class CategoryModule { }
