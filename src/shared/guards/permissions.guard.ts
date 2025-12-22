import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions) {
            return true; // If no permissions required, allow access
        }

        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            return false;
        }

        // Flatten permissions from all roles
        const userPermissions = new Set<string>();

        if (user.roles) {
            user.roles.forEach((userRole: any) => {
                if (userRole.role && userRole.role.permissions) {
                    userRole.role.permissions.forEach((rolePerm: any) => {
                        if (rolePerm.permission) {
                            userPermissions.add(rolePerm.permission.action);
                        }
                    });
                }
            });
        }

        // Check if user has ALL required permissions (or ANY? usually ALL)
        const result = requiredPermissions.every((perm) => userPermissions.has(perm));
        return result;
    }
}
