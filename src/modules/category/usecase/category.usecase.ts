import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repository/category.repository';

@Injectable()
export class CategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  // Aquí iría lógica CRUD simple que no requiere orquestación compleja
  // O clases específicas como 'CreateBicycleUseCase' si prefieres atomizar más
}
