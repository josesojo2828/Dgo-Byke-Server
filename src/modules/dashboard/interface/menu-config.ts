import { MenuItemDto } from "./dashboard.dto";

// Extendemos tu DTO solo para uso interno del backend
export interface MenuConfigItem extends MenuItemDto {
    requiredPermission?: string;
    children?: MenuConfigItem[];
}

// DEFINICIÓN DEL MENÚ MAESTRO COMPLETO
export const MASTER_MENU: MenuConfigItem[] = [

    // 1. DASHBOARD (General)
    {
        label: 'Panel de Control',
        route: '/',
        icon: 'LayoutDashboard',
    },

    // 2. GESTIÓN DE CARRERAS (Core)
    {
        label: 'Carreras',
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
                requiredPermission: 'race:action:create', // Permiso específico de creación
            }
        ]
    },

    // 3. LOGÍSTICA Y RUTAS (Tracks, Checkpoints, Categories)
    {
        label: 'Logística',
        route: '/logistics',
        icon: 'Map', // Icono genérico para mapas/logística
        children: [
            {
                label: 'Rutas / Pistas',
                route: '/tracks',
                icon: 'Route', // O 'MapPin'
                requiredPermission: 'track:action:read',
            },
            {
                label: 'Puntos de Control',
                route: '/checkpoints',
                icon: 'MapPin',
                requiredPermission: 'checkpoint:action:read',
            },
            {
                label: 'Categorías',
                route: '/categories',
                icon: 'Tags',
                requiredPermission: 'category:action:read',
            }
        ]
    },

    // 4. INSCRIPCIONES (Participants, Bicycles, Payments)
    {
        label: 'Inscripciones',
        route: '/registration',
        icon: 'ClipboardList',
        children: [
            {
                label: 'Participantes',
                route: '/participants',
                icon: 'Users', // O 'UserCheck'
                requiredPermission: 'participant:action:read',
            },
            {
                label: 'Bicicletas',
                route: '/bicycles',
                icon: 'Bike',
                requiredPermission: 'bicycle:action:read',
            },
            {
                label: 'Pagos',
                route: '/payments',
                icon: 'CreditCard',
                requiredPermission: 'payment:action:read',
            }
        ]
    },

    // 5. ADMINISTRACIÓN (Users, Orgs, OrgMembers)
    {
        label: 'Administración',
        route: '/admin',
        icon: 'ShieldCheck',
        children: [
            {
                label: 'Usuarios Sistema',
                route: '/users',
                icon: 'UserCog',
                requiredPermission: 'user:action:read',
            },
            {
                label: 'Organizaciones',
                route: '/organizations',
                icon: 'Building2',
                requiredPermission: 'organization:action:read',
            },
            {
                label: 'Miembros de Org.',
                route: '/org-members',
                icon: 'BadgeId', // O 'Contact'
                requiredPermission: 'org_member:action:read',
            }
        ]
    },

    // 6. SISTEMA (SuperAdmin)
    {
        label: 'Configuración',
        route: '/settings',
        icon: 'Settings',
        requiredPermission: 'system:action:manage',
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