import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/service/prisma.service';
import { MenuItemDto } from '../interface/dashboard.dto';
import { SystemPermissions } from '../../../modules/iam/system-permissions';
import { MASTER_MENU, MenuConfigItem } from '../interface/menu-config';
import { ROLE_ROOT_PATHS, SystemRole } from 'src/shared/types/system.type';

@Injectable()
export class DashboardService {
    constructor(
        private readonly prisma: PrismaService
    ) {
        const entity = SystemPermissions;
    }

    public async getMenu(userPermissions: string[], userRole: SystemRole): Promise<MenuItemDto[]> {
        const permissionsSet = new Set(userPermissions);

        const basePath = ROLE_ROOT_PATHS[userRole] || '/app';
        return this.filterMenuRecursive(MASTER_MENU, permissionsSet, basePath);
    }

    private filterMenuRecursive(
        items: MenuConfigItem[],
        permissionsSet: Set<string>,
        basePath: string // <--- Nuevo argumento
    ): MenuItemDto[] {
        const filteredItems: MenuItemDto[] = [];

        for (const item of items) {
            const hasAccess = this.checkAccess(item.requiredPermission, permissionsSet);

            if (hasAccess) {
                // RECURSIVIDAD PARA HIJOS
                let children: MenuItemDto[] | undefined;
                if (item.children && item.children.length > 0) {
                    children = this.filterMenuRecursive(item.children, permissionsSet, basePath);
                }

                // 3. CONCATENACIÓN INTELIGENTE
                // Si la ruta es absoluta (http...) no la tocamos.
                // Si es relativa, le pegamos el basePath.
                const finalRoute = item.route.startsWith('http')
                    ? item.route
                    : `${basePath}${item.route}`;

                filteredItems.push({
                    label: item.label,
                    route: finalRoute, // <--- Aquí va '/admin/users' o '/organizer/users'
                    icon: item.icon,
                    children: children && children.length > 0 ? children : undefined
                });
            }
        }
        return filteredItems;
    }

    private checkAccess(requiredPermission: string | undefined, userPermissions: Set<string>): boolean {
        // Si no requiere permiso, es público (pasa)
        if (!requiredPermission) return true;

        // Si requiere permiso, verifica si está en el Set del usuario
        return userPermissions.has(requiredPermission);
    }

}
