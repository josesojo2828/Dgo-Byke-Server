import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../repository/organization.repository';

@Injectable()
export class OrganizationUseCase {
  constructor(private readonly repository: OrganizationRepository) {}

  // Aquí iría lógica CRUD simple que no requiere orquestación compleja
  // O clases específicas como 'CreateBicycleUseCase' si prefieres atomizar más
}
