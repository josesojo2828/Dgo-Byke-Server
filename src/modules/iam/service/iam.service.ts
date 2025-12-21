
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IamRepository } from '../repository/iam.repository';
import { AssignPermissionDto, AssignRoleDto, CreatePermissionDto, CreateRoleDto } from '../interface/iam.dto';
import { DomainEvent } from 'src/shared/event/domain-listener';

@Injectable()
export class IamService {
    constructor(
        private readonly repository: IamRepository,
        private readonly eventEmitter: EventEmitter2
    ) { }

    async createRole(dto: CreateRoleDto) {
        this.eventEmitter.emit(
            'role:pre:create',
            new DomainEvent({
                entityName: 'Role',
                action: 'pre:create',
                payload: dto,
            }),
        );
        const result = await this.repository.createRole(dto);
        this.eventEmitter.emit(
            'role:post:create',
            new DomainEvent({
                entityName: 'Role',
                action: 'post:create',
                payload: result,
            }),
        );
        return result;
    }

    async findAllRoles() {
        return this.repository.findAllRoles();
    }

    async createPermission(dto: CreatePermissionDto) {
        this.eventEmitter.emit(
            'permission:pre:create',
            new DomainEvent({
                entityName: 'Permission',
                action: 'pre:create',
                payload: dto,
            }),
        );
        const result = await this.repository.createPermission(dto);
        this.eventEmitter.emit(
            'permission:post:create',
            new DomainEvent({
                entityName: 'Permission',
                action: 'post:create',
                payload: result,
            }),
        );
        return result;
    }

    async findAllPermissions() {
        return this.repository.findAllPermissions();
    }

    async assignPermissionToRole(dto: AssignPermissionDto) {
        this.eventEmitter.emit(
            'role:pre:assign-permission',
            new DomainEvent({
                entityName: 'Role',
                action: 'pre:assign-permission',
                payload: dto,
            }),
        );
        const result = await this.repository.assignPermissionToRole(dto);
        this.eventEmitter.emit(
            'role:post:assign-permission',
            new DomainEvent({
                entityName: 'Role',
                action: 'post:assign-permission',
                payload: result,
            }),
        );
        return result;
    }

    async assignRoleToUser(dto: AssignRoleDto) {
        this.eventEmitter.emit(
            'user:pre:assign-role',
            new DomainEvent({
                entityName: 'User',
                action: 'pre:assign-role',
                payload: dto,
            }),
        );
        const result = await this.repository.assignRoleToUser(dto);
        this.eventEmitter.emit(
            'user:post:assign-role',
            new DomainEvent({
                entityName: 'User',
                action: 'post:assign-role',
                payload: result,
            }),
        );
        return result;
    }
}
