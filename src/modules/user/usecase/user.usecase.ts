import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserUseCase {
  constructor(private readonly repository: UserRepository) {}

  // Aquí iría lógica CRUD simple que no requiere orquestación compleja
  // O clases específicas como 'CreateBicycleUseCase' si prefieres atomizar más
}
