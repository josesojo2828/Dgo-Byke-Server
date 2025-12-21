import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module'; // Adjust path if needed
import { UserService } from '../src/modules/user/service/user.service';
import { IamService } from '../src/modules/iam/service/iam.service';
import { SystemPermissions } from '../src/modules/iam/system-permissions';
import { PrismaService } from '../src/shared/service/prisma.service'; // Or import from module if exported
import { CreateUserDto } from '../src/modules/user/interface/user.dto';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const userService = app.get(UserService);
    const iamService = app.get(IamService);
    const prismaService = app.get(PrismaService); // Helper for raw checks if needed

    console.log('Seeding database using Services...');

    // 1. Roles Definition
    const rolesData = [
        { name: 'SUPER_ADMIN', description: 'System Root User' },
        { name: 'ORGANIZER', description: 'Race Organizer' },
        { name: 'TIMING_OFFICIAL', description: 'Checkpoint Judge' },
        { name: 'USER', description: 'Regular Cyclist' },
    ];

    for (const r of rolesData) {
        // Use IAM Service if possible, or raw if service doesn't support upsert by name
        // Our IamService.createRole is strict Create, so let's check existence first
        // Ideally we would add 'findByName' to IamService, but for now we can use PrismaService helper or try/catch
        const existing = await prismaService.role.findUnique({ where: { name: r.name } });
        if (!existing) {
            await iamService.createRole(r);
            console.log(`Role created: ${r.name}`);
        }
    }

    // 2. Permissions Definition
    const allPermissions = SystemPermissions.getAll();
    console.log(`Seeding ${allPermissions.length} permissions...`);

    for (const action of allPermissions) {
        const description = `Allows ${action.split(':').pop()} on ${action.split(':')[0]}`;
        const existing = await prismaService.permission.findUnique({ where: { action } });

        if (!existing) {
            await iamService.createPermission({ action, description });
        }
    }
    console.log('Permissions seeded.');

    // 3. Assign Permissions to Roles (RBAC)
    const assign = async (roleName: string, actions: string[]) => {
        const role = await prismaService.role.findUnique({ where: { name: roleName } });
        if (!role) return;

        for (const action of actions) {
            const perm = await prismaService.permission.findUnique({ where: { action } });
            if (perm) {
                // Check if assigned
                const assigned = await prismaService.rolePermission.findUnique({
                    where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } }
                });

                if (!assigned) {
                    await iamService.assignPermissionToRole({ roleId: role.id, permissionId: perm.id });
                }
            }
        }
    };

    // SUPER_ADMIN gets ALL
    await assign('SUPER_ADMIN', SystemPermissions.getAll());

    // ORGANIZER
    await assign('ORGANIZER', [
        SystemPermissions.Races.Create,
        SystemPermissions.Races.Read,
        SystemPermissions.Races.Update,
        SystemPermissions.Races.Delete,
        SystemPermissions.Organizations.Read,
        SystemPermissions.Organizations.Update,
    ]);

    // TIMING_OFFICIAL
    await assign('TIMING_OFFICIAL', [
        SystemPermissions.Timing.Record,
        SystemPermissions.Timing.Verify,
        SystemPermissions.Timing.Read,
    ]);

    // 4. Create Super Admin User via Service (Hashing included)
    const adminEmail = 'admin@dgobyke.com';
    const existingAdmin = await userService.findByEmail(adminEmail);

    let adminUserId = existingAdmin?.id;

    if (!existingAdmin) {
        const newAdmin = await userService.create({
            email: adminEmail,
            // Password will be hashed by UserService now
            password: 'abc.12345',
            fullName: 'Super Admin',
            isActive: true,
            // Any other required fields
        } as CreateUserDto);
        adminUserId = newAdmin.id;
        console.log(`Super Admin user created: ${adminEmail} via UserService`);
    } else {
        console.log(`Super Admin user already exists: ${adminEmail}`);
    }

    // Assign Role via Service
    if (adminUserId) {
        const superAdminRole = await prismaService.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
        if (superAdminRole) {
            const hasRole = await prismaService.userRole.findUnique({
                where: { userId_roleId: { userId: adminUserId, roleId: superAdminRole.id } }
            });

            if (!hasRole) {
                await iamService.assignRoleToUser({ userId: adminUserId, roleId: superAdminRole.id });
                console.log('Assigned SUPER_ADMIN role to user via IamService');
            }
        }
    }

    await app.close();
}

bootstrap()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
