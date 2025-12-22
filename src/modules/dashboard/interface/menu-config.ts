import { MenuItemDto } from "./dashboard.dto";

// Extendemos tu DTO solo para uso interno del backend
export interface MenuConfigItem extends MenuItemDto {
    requiredPermission?: string; // El string mágico (ej: 'user:action:read')
    children?: MenuConfigItem[];
}

// DEFINICIÓN DEL MENÚ MAESTRO
export const MASTER_MENU: MenuConfigItem[] = [
    {
        label: 'Panel de Control',
        route: '/',
        icon: 'LayoutDashboard',
    },
    {
        label: 'Usuarios',
        route: '/users',
        icon: 'Users',
        requiredPermission: 'user:action:read', // <--- REQUISITO
    },
    {
        label: 'Organizaciones',
        route: '/organizations',
        icon: 'Building2',
        requiredPermission: 'organization:action:read',
    },
    {
        label: 'Gestión de Carreras',
        route: '/races',
        icon: 'Flag',
        requiredPermission: 'race:action:read',
        children: [
            {
                label: 'Lista de Carreras',
                route: '/races/list',
                icon: 'List',
                requiredPermission: 'race:action:read',
            },
            {
                label: 'Crear Carrera',
                route: '/races/create',
                icon: 'PlusCircle',
                requiredPermission: 'race:action:create',
            },
            {
                label: 'Cronometraje',
                route: '/races/timing',
                icon: 'Timer',
                requiredPermission: 'timing:action:read',
            }
        ]
    },
    {
        label: 'Configuración',
        route: '/settings',
        icon: 'Settings',
        requiredPermission: 'system:action:manage', // Solo SuperAdmin
        children: [
            {
                label: 'Auditoría',
                route: '/audit',
                icon: 'FileText',
                requiredPermission: 'system:action:manage',
            }
        ]
    }
];