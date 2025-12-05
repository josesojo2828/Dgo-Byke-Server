import { PrismaClient, UserStatus, SubscriptionStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Configuración
const USER_COUNT = 10;
const PAYMENTS_PER_USER = 2;
const HISTORY_COUNT = 4;

async function main() {
    console.log('🌱 Iniciando Seeding...');

    // 1. Obtener datos base necesarios (Asumiendo que ya corriste migraciones/fixtures básicos)
    // Si no tienes fixtures, deberías crearlos aquí mismo antes de los usuarios.

    const permits = await prisma.permit.findMany();
    const plans = await prisma.subscriptionPlan.findMany();
    const basePaymentMethods = await prisma.paymentMethod.findMany();

    if (permits.length === 0 || plans.length === 0 || basePaymentMethods.length === 0) {
        throw new Error('❌ Faltan datos base (Permisos, Planes o Métodos de Pago). Asegúrate de tener datos maestros.');
    }

    // Buscamos un permiso de usuario
    const userPermit = permits.find(p => p.name.toUpperCase().includes('USER')) || permits[0];

    // Hash de contraseña (una vez para todos para optimizar)
    const passwordHash = await bcrypt.hash('abc.12345', 10);

    console.log(`🚀 Creando ${USER_COUNT} usuarios con historial...`);

    for (let i = 0; i < USER_COUNT; i++) {
        // Generar datos de usuario
        const sex = faker.person.sexType();
        const firstName = faker.person.firstName(sex);
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName }).toLowerCase();
        const username = (faker.internet.username({ firstName, lastName }) + faker.string.numeric(3)).toLowerCase();

        // CREAR EL USUARIO COMPLETO (Con Wallet y Suscripción Free inicial)
        // Prisma permite escrituras anidadas, así que hacemos todo en una sola query.
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                fullName: `${firstName} ${lastName}`,
                email,
                username,
                password: passwordHash,
                status: UserStatus.ACTIVE,
                permitId: userPermit.id,

                // Crear Wallet automáticamente
                wallet: {
                    create: {
                        balance: faker.finance.amount({ min: 0, max: 1000, dec: 2 }),
                        currency: 'USD'
                    }
                },

                // Crear Suscripción "Free" inicial (si tienes un plan llamado 'Free')
                // Si no, puedes omitir esto o asignar uno random
                subscriptions: {
                    create: {
                        planId: plans[0].id, // Asigna el primer plan disponible como el actual
                        autoRenew: false,
                        status: SubscriptionStatus.ACTIVE
                    }
                }
            }
        });

        // 2. AGREGAR MÉTODOS DE PAGO
        for (let j = 0; j < PAYMENTS_PER_USER; j++) {
            const baseMethod = faker.helpers.arrayElement(basePaymentMethods);
            let details = {};

            if (baseMethod.code === 'CARD') {
                details = {
                    last4: faker.finance.creditCardNumber('####'),
                    brand: faker.finance.creditCardIssuer(),
                    expMonth: faker.number.int({ min: 1, max: 12 }),
                    expYear: faker.number.int({ min: 2025, max: 2030 })
                };
            } else if (baseMethod.code === 'PAYPAL') {
                details = { email: faker.internet.email({ provider: 'paypal.com' }) };
            }

            await prisma.userPaymentMethod.create({
                data: {
                    userId: user.id,
                    paymentMethodId: baseMethod.id,
                    details: details as any,
                    isDefault: j === 0,
                    active: true
                }
            });
        }

        // 3. AGREGAR HISTORIAL DE SUSCRIPCIONES (PASADAS)
        // Usamos createMany para velocidad, pero createMany no soporta relaciones anidadas profundas fácil en todos los DBs,
        // así que un bucle simple está bien para pocos datos.
        for (let k = 0; k < HISTORY_COUNT; k++) {
            const plan = faker.helpers.arrayElement(plans);

            // Calcular fechas pasadas
            const daysAgoStart = (k + 1) * 60; // Bloques de 2 meses atrás
            const startDate = faker.date.recent({ days: 30, refDate: new Date(Date.now() - daysAgoStart * 24 * 60 * 60 * 1000) });
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);

            await prisma.subscription.create({
                data: {
                    userId: user.id,
                    planId: plan.id,
                    startDate: startDate,
                    endDate: endDate,
                    status: faker.helpers.arrayElement([SubscriptionStatus.EXPIRED, SubscriptionStatus.CANCELED]),
                    autoRenew: false,
                    // Truco: Forzar createdAt antiguo si quieres que se ordenen por fecha de creación en la DB
                    createdAt: startDate
                }
            });
        }

        process.stdout.write('.'); // Barra de progreso simple
    }

    console.log('\n✅ Seeding finalizado correctamente.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });