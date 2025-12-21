import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../shared/service/prisma.service';
import { SystemPermissions } from '../../modules/iam/system-permissions';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DataSeederService implements OnModuleInit {
    // Constant UUID for Super Admin to ensure idempotency
    private readonly SUPER_ADMIN_ID = '11111111-1111-1111-1111-111111111111';

    constructor(private readonly prisma: PrismaService) {
        console.log('DataSeederService initialized');
    }

    async onModuleInit() {
        console.log('Executing Auto-Seeding...');
        await this.seedRoles();
        await this.seedPermissions();
        await this.seedSuperAdmin();
        console.log('Auto-Seeding Completed.');
    }

    private async seedRoles() {
        const roles = [
            { name: 'SUPER_ADMIN', description: 'System Root User' },
            { name: 'ORGANIZER', description: 'Race Organizer' },
            { name: 'TIMING_OFFICIAL', description: 'Checkpoint Judge' },
            { name: 'USER', description: 'Regular Cyclist' },
        ];

        for (const role of roles) {
            await this.prisma.role.upsert({
                where: { name: role.name },
                update: {}, // No changes if exists
                create: role,
            });
        }
    }

    private async seedPermissions() {
        const allPermissions = SystemPermissions.getAll();
        for (const action of allPermissions) {
            const description = `Allows ${action.split(':').pop()} on ${action.split(':')[0]}`;
            await this.prisma.permission.upsert({
                where: { action },
                update: {},
                create: { action, description },
            });
        }

        // Assign ALL permissions to SUPER_ADMIN
        // We need to fetch the role first
        const superAdminRole = await this.prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
        if (!superAdminRole) return;

        for (const action of allPermissions) {
            const perm = await this.prisma.permission.findUnique({ where: { action } });
            if (perm) {
                await this.prisma.rolePermission.upsert({
                    where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: perm.id } },
                    update: {},
                    create: { roleId: superAdminRole.id, permissionId: perm.id },
                });
            }
        }
    }

    private async seedSuperAdmin() {
        const adminEmail = 'admin@dgobyke.com';
        // Hashear password localmente para asegurar upsert limpio
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash('abc.12345', salt);

        // Upsert User
        // Note: We use unique email check. If ID differs but email exists, upsert handles it by 'where: email'.
        const user = await this.prisma.user.upsert({
            where: { email: adminEmail },
            update: {}, // Don't overwrite if exists to preserve data (or update password if you want to reset it always)
            create: {
                id: this.SUPER_ADMIN_ID,
                email: adminEmail,
                password: hashedPassword,
                fullName: 'Super Admin',
                isActive: true,
                systemRole: 'ADMIN', // Legacy enum if needed
            },
        });

        // Assign Role
        const superAdminRole = await this.prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
        if (superAdminRole) {
            await this.prisma.userRole.upsert({
                where: { userId_roleId: { userId: user.id, roleId: superAdminRole.id } },
                update: {},
                create: { userId: user.id, roleId: superAdminRole.id },
            });
        }
    }
}
