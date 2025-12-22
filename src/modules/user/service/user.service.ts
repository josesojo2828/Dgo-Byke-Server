import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto, UpdateUserDto } from '../interface/user.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async create(createDto: CreateUserDto) {
    // Hash password if present
    if (createDto.password) {
      const salt = await bcrypt.genSalt();
      createDto.password = await bcrypt.hash(createDto.password, salt);
    }

    // 1. Pre-Event
    this.eventEmitter.emit(
      'user:pre:create',
      new DomainEvent({
        entityName: 'User',
        action: 'pre:create',
        payload: createDto,
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.create(createDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'user:post:create',
      new DomainEvent({
        entityName: 'User',
        action: 'post:create',
        payload: result,
      }),
    );

    return result;
  }

  async findAll(params?: any) {
    // Basic FindAll - can be extended with events if needed (e.g. audit read)
    return this.repository.findAll(params);
  }

  async findOne(id: string) {
    return this.repository.findOne(id);
  }

  async findByToken(tk: string) {
    return this.repository.findToken(tk);
  }

  async update(id: string, updateDto: UpdateUserDto) {
    // Hash password if present
    if (updateDto.password) {
      const salt = await bcrypt.genSalt();
      updateDto.password = await bcrypt.hash(updateDto.password, salt);
    }

    // 1. Pre-Event
    this.eventEmitter.emit(
      'user:pre:update',
      new DomainEvent({
        entityName: 'User',
        action: 'pre:update',
        payload: { id, ...updateDto },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.update(id, updateDto);

    // 3. Post-Event
    this.eventEmitter.emit(
      'user:post:update',
      new DomainEvent({
        entityName: 'User',
        action: 'post:update',
        payload: result,
      }),
    );

    return result;
  }

  async remove(id: string) {
    // 1. Pre-Event
    this.eventEmitter.emit(
      'user:pre:delete',
      new DomainEvent({
        entityName: 'User',
        action: 'pre:delete',
        payload: { id },
      }),
    );

    // 2. Repository Logic
    const result = await this.repository.remove(id);

    // 3. Post-Event
    this.eventEmitter.emit(
      'user:post:delete',
      new DomainEvent({
        entityName: 'User',
        action: 'post:delete',
        payload: result,
      }),
    );

    return result;
  }

  async findByEmail(email: string) {
    return this.repository.findByEmail(email);
  }

  async findWithPermissions(id: string) {
    return this.repository.findWithPermissions(id);
  }

  async setToken(id: string, token: string) {
    return this.repository.update(id, { token });
  }

  extractPermissions = (user: any): string[] => {
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      return [];
    }

    // Usamos un Set para evitar duplicados si dos roles tienen el mismo permiso
    const permissionsSet = new Set<string>();

    // 1. Recorremos los roles asignados al usuario
    user.roles.forEach((userRole: any) => {

      // Validamos que el rol y sus permisos existan
      if (userRole.role && Array.isArray(userRole.role.permissions)) {

        // 2. Recorremos los permisos dentro de ese rol
        userRole.role.permissions.forEach((rolePermission: any) => {

          // 3. Accedemos al objeto 'permission' y luego a la 'action'
          if (rolePermission.permission && rolePermission.permission.action) {
            permissionsSet.add(rolePermission.permission.action);
          }
        });
      }
    });

    // Convertimos el Set de vuelta a un Array
    return Array.from(permissionsSet);
  };
}

