import { Injectable } from "@nestjs/common";
import { fakerES as faker } from '@faker-js/faker'; // Usamos fakerES para datos en español
// Servicios y Repositorios
import { LoggerService } from "../logger/logger.service";
import { PrismaService } from "../service/prisma.service";
import { BikeType, OrgRole, RaceStatus, RaceType, SystemRole } from "../types/system.type";
import { UserRepository } from "src/modules/user/repository/user.repository";
import { CategoryRepository } from "src/modules/category/repository/category.repository";
import { OrganizationRepository } from "src/modules/organization/repository/organization.repository";
import { OrganizationMemberRepository } from "src/modules/organization-member/repository/organization-member.repository";
import { ParticipantRepository } from "src/modules/participant/repository/participant.repository";
import { RaceRepository } from "src/modules/race/repository/race.repository";
import { RaceEventRepository } from "src/modules/race-event/repository/race-event.repository";
import { TrackRepository } from "src/modules/track/repository/track.repository";
import * as bcrypt from 'bcrypt';
import { get } from "http";

interface FakerConfig {
    userCount: number;
    paymentsByUser: number;
    historyCount: number; // Cantidad de suscripciones pasadas
}

@Injectable()
export class FakerInitService {

    constructor(
        private readonly logger: LoggerService,
        private readonly prisma: PrismaService,
        private readonly userRepository: UserRepository,
        private readonly categoryRepository: CategoryRepository,
        private readonly organizationRepository: OrganizationRepository,
        // private readonly organizationMemberRepository: OrganizationMemberRepository,
        private readonly participantRepository: ParticipantRepository,
        private readonly raceRepository: RaceRepository,
        private readonly raceEventRepository: RaceEventRepository,
        private readonly trackRepository: TrackRepository,
    ) {
        // this.pipeline();
    }

    public async pipeline() {
        await this.main();
    }

    private random(arr: any[]) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    private async main() {
        console.log('🌱 Iniciando seed...');

        console.log('Categorias [INICIO]');
        const categoriesList: any[] = [];
        racerCategories.forEach(async (discipline) => {
            const category = await this.categoryRepository.create({
                name: discipline.name,
                minAge: discipline.minAge,
                maxAge: discipline.maxAge,
                gender: discipline.gender,
                // id: discipline.id
            });
            console.log(discipline.name, 'CREADO.');
            categoriesList.push(category);
        });

        const cts = await this.categoryRepository.findAll();

        console.log(cts);

        return;

        if (!cts) {
            console.log('No se pudo obtener las categorías');
            return;
        }

        const md = medicalRecords;
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash('abc.12345', salt);

        // Create Users + Perfil de ciclista
        // for (let index = 0; index < 10; index++) {
        //     const medical = getRandomElement(md);
        //     const ct = getRandomElement(cts);

        //     await this.userRepository.create({
        //         email: getRandomElement(emailAddresses),
        //         password: password,
        //         fullName: getRandomElement(firstNames) + ' ' + getRandomElement(lastNames),
        //         phone: faker.phone.number(),
        //         avatarUrl: faker.image.avatar(),
        //         isActive: true,
        //         metadata: { generate: 'AUTO-DATAFIXTURE' },
        //         cyclistProfile: {
        //             create: {
        //                 weight: medical.weight,
        //                 height: medical.height,
        //                 bloodType: medical.bloodType,
        //                 jerseySize: medical.jerseySize,
        //                 emergencyContactName: medical.emergencyContactName,
        //                 emergencyContactPhone: medical.emergencyContactPhone,
        //                 category: { connect: { id: ct.id } },
        //                 allergies: medical.allergies,
        //                 bicycles: {
        //                     create: {
        //                         ...getRandomElement(bicyclesData),
        //                     }
        //                 }
        //                 // teamName: medical.teamName,
        //                 // bicycles: {
        //                 //     create: {
        //                 //         brand: getRandomElement(cyclingDisciplines).id,
        //                 //         model: getRandomElement(cyclingDisciplines).id,
        //                 //         type: getRandomElement(cyclingDisciplines).id,
        //                 //         color: getRandomElement(cyclingDisciplines).id,
        //                 //         serialNumber: faker.vehicle.vin(),
        //                 //     }
        //                 // }
        //             }
        //         }
        //     })

        // };

        const users = await this.userRepository.findAll();
        const profiles = await this.prisma.cyclistProfile.findMany();

        console.log('Creando organizaciones + miembros...');
        // for (let index = 0; index < 10; index++) {
        //     const org = await this.organizationRepository.create({
        //         name: faker.company.name(),
        //         slug: faker.helpers.slugify(faker.company.name()).toLowerCase(),
        //         description: faker.lorem.paragraph(),
        //         members: {

        //             createMany: {
        //                 data: [
        //                     {
        //                         userId: getRandomElement(users).id,
        //                         role: 'ADMIN',
        //                         position: 'Director General'
        //                     },
        //                     {
        //                         userId: getRandomElement(users).id,
        //                         role: 'OWNER',
        //                         position: 'Director General'
        //                     },
        //                     {
        //                         userId: getRandomElement(users).id,
        //                         role: 'MEMBER',
        //                         position: 'Director General'
        //                     },
        //                     {
        //                         userId: getRandomElement(users).id,
        //                         role: 'MEMBER',
        //                         position: 'Director General'
        //                     },
        //                     {
        //                         userId: getRandomElement(users).id,
        //                         role: 'MEMBER',
        //                         position: 'Director General'
        //                     },
        //                     {
        //                         userId: getRandomElement(users).id,
        //                         role: 'MEMBER',
        //                         position: 'Director General'
        //                     },
        //                     {
        //                         userId: getRandomElement(users).id,
        //                         role: 'MEMBER',
        //                         position: 'Director General'
        //                     }
        //                 ],
        //                 skipDuplicates: true,
        //             }

        //         }
        //     });

        //     console.log(org.name, 'CREADO.');
        // }

        console.log('Creando rutas...');
        // for (let index = 0; index < 10; index++) {
        //     const track = await this.trackRepository.create({
        //         name: faker.location.city(),
        //         distanceKm: faker.number.float({ min: 10, max: 120, multipleOf: 0.5 }),
        //         elevationGain: faker.number.float({ min: 100, max: 2500 }),
        //         latitude: faker.location.latitude(),
        //         longitude: faker.location.longitude(),
        //         // GeoJSON Simulado (Un array de puntos simple)
        //         geoData: {
        //             type: "Feature",
        //             properties: {},
        //             geometry: {
        //                 type: "LineString",
        //                 coordinates: [
        //                     [faker.location.longitude(), faker.location.latitude()],
        //                     [faker.location.longitude(), faker.location.latitude()],
        //                     [faker.location.longitude(), faker.location.latitude()],
        //                     [faker.location.longitude(), faker.location.latitude()],
        //                     [faker.location.longitude(), faker.location.latitude()],
        //                     [faker.location.longitude(), faker.location.latitude()],
        //                     [faker.location.longitude(), faker.location.latitude()],
        //                     [faker.location.longitude(), faker.location.latitude()]
        //                 ]
        //             }
        //         },
        //         checkpoints: {
        //             create: [
        //                 { name: 'Salida', order: 0, isStart: true, latitude: 0, longitude: 0 },
        //                 { name: 'Meta', order: 1, isFinish: true, latitude: 0, longitude: 0 }
        //             ]
        //         }
        //     });

        //     console.log(track.name, 'CREADO.');
        // }

        const tracks = await this.trackRepository.findAll();
        const organizacions = await this.organizationRepository.findAll();

        if(!organizacions) {
            console.log('No se pudo obtener las organizaciones');
            return;
        }

        if(!tracks) {
            console.log('No se pudo obtener las rutas');
            return;
        }

        console.log('Creando carreras...');
        for (let index = 0; index < 10; index++) {

            const categories1 = getRandomElement(cts);
            const categories2 = getRandomElement(cts);

            const race = await this.raceRepository.create({
                name: faker.lorem.sentence(),
                date: faker.date.future(),
                type: RaceType.CIRCUITO,
                laps: 5,
                price: 10.00,
                creator: { connect: { id: getRandomElement(users).id } },
                organization: { connect: { id: getRandomElement(organizacions).id } },
                track: { connect: { id: getRandomElement(tracks).id } },
                categories: { connect: [{ id: categories1.id }, { id: categories2.id }] },
            });

            console.log(race.name, 'CREADO.');
        }



        const races = await this.raceRepository.findAll();

        if(!races) {
            console.log('No se pudo obtener las carreras');
            return;
        }

        console.log('Creando participantes...');
        for (let index = 0; index < 10; index++) {
            const race = getRandomElement(races);
            const profile = getRandomElement(profiles);

            const cicles = await this.prisma.bicycle.findFirst({
                where: { 
                    AND: [
                        {deletedAt: null},
                        { cyclistProfileId: profile.id }
                    ]
                 },
                orderBy: { createdAt: 'desc' }
            });

            await this.participantRepository.create({
                race: { connect: { id: race.id } },
                profile: { connect: { id: profile.id } },
                bicycle: { connect: { id: cicles?.id } },
                bibNumber: faker.number.int({ min: 1, max: 999 }),
                hasPaid: true,
                status: 'FINISHED',
                finalTime: faker.date.future().getTime(),
                rank: index + 1,
            });
        }

    }   
}

export interface RacerCategory {
    id: string;
    name: string;
    minAge: number;
    maxAge: number | null; // null significa "sin límite superior"
    gender: string;
    isElite?: boolean; // Opcional: para diferenciar pros de amateurs
}

export const racerCategories: RacerCategory[] = [
    // --- Categorías Juveniles ---
    {
        id: 'CADET_M',
        name: 'Cadete Masculino',
        minAge: 15,
        maxAge: 16,
        gender: 'M'
    },
    {
        id: 'CADET_F',
        name: 'Cadete Femenino',
        minAge: 15,
        maxAge: 16,
        gender: 'F'
    },
    {
        id: 'JUNIOR_M',
        name: 'Junior Masculino',
        minAge: 17,
        maxAge: 18,
        gender: 'M'
    },
    {
        id: 'JUNIOR_F',
        name: 'Junior Femenino',
        minAge: 17,
        maxAge: 18,
        gender: 'F'
    },

    // --- Sub-23 y Elite ---
    {
        id: 'U23_M',
        name: 'Sub-23 Masculino',
        minAge: 19,
        maxAge: 22,
        gender: 'M',
        isElite: true
    },
    {
        id: 'U23_F',
        name: 'Sub-23 Femenino',
        minAge: 19,
        maxAge: 22,
        gender: 'F',
        isElite: true
    },
    {
        id: 'ELITE_M',
        name: 'Elite Masculino',
        minAge: 23,
        maxAge: 34, // A veces es hasta 29 o sin límite, depende del reglamento
        gender: 'M',
        isElite: true
    },
    {
        id: 'ELITE_F',
        name: 'Elite Femenino',
        minAge: 23,
        maxAge: 34,
        gender: 'F',
        isElite: true
    },

    // --- Masters (Amateur por edad) ---
    {
        id: 'MASTER_A_M',
        name: 'Master A (30-39) Masculino',
        minAge: 30,
        maxAge: 39,
        gender: 'M'
    },
    {
        id: 'MASTER_A_F',
        name: 'Master A (30-39) Femenino',
        minAge: 30,
        maxAge: 39,
        gender: 'F'
    },
    {
        id: 'MASTER_B_M',
        name: 'Master B (40-49) Masculino',
        minAge: 40,
        maxAge: 49,
        gender: 'M'
    },
    {
        id: 'MASTER_B_F',
        name: 'Master B (40-49) Femenino',
        minAge: 40,
        maxAge: 49,
        gender: 'F'
    },
    {
        id: 'MASTER_C_M',
        name: 'Master C (50-59) Masculino',
        minAge: 50,
        maxAge: 59,
        gender: 'M'
    },
    {
        id: 'MASTER_D_M',
        name: 'Master D (60+) Masculino',
        minAge: 60,
        maxAge: null, // Sin límite superior
        gender: 'M'
    },
    {
        id: 'MASTER_D_F',
        name: 'Master D (60+) Femenino',
        minAge: 60,
        maxAge: null,
        gender: 'F'
    }
];

// --- 1. Array de Nombres (45 elementos) ---
export const firstNames: string[] = [
    "Alejandro", "María", "Javier", "Ana", "Carlos",
    "Sofía", "Miguel", "Lucía", "David", "Paula",
    "José", "Elena", "Manuel", "Carmen", "Antonio",
    "Marta", "Francisco", "Isabel", "Luis", "Laura",
    "Juan", "Andrea", "Pedro", "Sara", "Daniel",
    "Claudia", "Sergio", "Patricia", "Jorge", "Irene",
    "Pablo", "Teresa", "Fernando", "Natalia", "Diego",
    "Beatriz", "Rafael", "Cristina", "Ángel", "Rosa",
    "Andrés", "Julia", "Gabriel", "Adriana", "Héctor"
];

// --- 2. Array de Apellidos (45 elementos) ---
export const lastNames: string[] = [
    "García", "Rodríguez", "González", "Fernández", "López",
    "Martínez", "Sánchez", "Pérez", "Gómez", "Martín",
    "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno",
    "Muñoz", "Álvarez", "Romero", "Alonso", "Gutiérrez",
    "Navarro", "Torres", "Domínguez", "Vázquez", "Ramos",
    "Gil", "Ramírez", "Serrano", "Blanco", "Molina",
    "Morales", "Suárez", "Ortega", "Delgado", "Castro",
    "Ortiz", "Rubio", "Marín", "Sanz", "Iglesias",
    "Nuñez", "Medina", "Garrido", "Santos", "Castillo"
];

export interface MedicalData {
    id: number;
    weight: number;      // Float (kg)
    height: number;      // Int/Float (cm)
    jerseySize: 'XS' | 'S' | 'M' | 'L' | 'XL';
    bloodType: string;
    allergies: string | null;
    emergencyContactName: string;
    emergencyContactPhone: string;
}

const JERSEY_SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMMON_ALLERGIES = [
    null, null, null, null, // Mayor probabilidad de no tener alergias
    'Polen', 'Penicilina', 'Nueces', 'Lactosa', 'Picaduras de abeja', 'Gluten', 'Mariscos'
];
// Reusamos nombres comunes para los contactos de emergencia
const CONTACT_NAMES = [
    "Maria Pérez", "Juan Gonzalez", "Pedro Rodriguez", "Ana Lopez",
    "Carlos Garcia", "Luisa Martinez", "Jose Hernandez", "Elena Diaz"
];

// Función helper simple (si no importas la anterior)
const getRandom = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- 3. Generación del Array (40+ Elementos) ---

export const medicalRecords: MedicalData[] = Array.from({ length: 45 }, (_, index) => {

    const weight = parseFloat((Math.random() * (90 - 50) + 50).toFixed(1));
    const height = Math.floor(Math.random() * (195 - 160) + 160);

    let size: typeof JERSEY_SIZES[number];
    if (weight < 60) size = 'XS';
    else if (weight < 70) size = 'S';
    else if (weight < 80) size = 'M';
    else if (weight < 88) size = 'L';
    else size = 'XL';

    return {
        id: index + 1,
        weight: weight,
        height: height,
        jerseySize: size, // O podrías usar getRandom(JERSEY_SIZES) si quieres aleatoriedad pura
        bloodType: getRandom(BLOOD_TYPES),
        allergies: getRandom(COMMON_ALLERGIES),
        emergencyContactName: getRandom(CONTACT_NAMES),
        // Generar un teléfono ficticio
        emergencyContactPhone: `+58 412 ${Math.floor(Math.random() * 899 + 100)} ${Math.floor(Math.random() * 8999 + 1000)}`
    };
});

const emailDomains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.es", "icloud.com", "protonmail.com"];

/**
 * Helper para limpiar texto:
 * 1. Pasa a minúsculas
 * 2. Elimina tildes (Á -> A -> a) usando normalización NFD
 * 3. Elimina espacios si los hubiera
 */
const normalizeText = (text: string): string => {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '');
};

// --- Generación del Array de Correos (45 elementos) ---
export const emailAddresses: string[] = Array.from({ length: 45 }, () => {

    const name = normalizeText(getRandomElement(firstNames));
    const lastName = normalizeText(getRandomElement(lastNames));
    const domain = getRandomElement(emailDomains);

    // Agregamos un número aleatorio corto al final para darle realismo y evitar duplicados
    // Ej: maria.perez23@gmail.com
    const randomSuffix = Math.floor(Math.random() * 99) + 1;

    return `${name}.${lastName}${randomSuffix}@${domain}`;
});

function getRandomElement<T>(items: T[]): T {
    if (items.length === 0) {
        throw new Error("El array no puede estar vacío");
    }
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}

export const bicyclesData = [
    // 1. RUTA (Road) - Gama Alta
    {
        brand: 'Specialized',
        model: 'Tarmac SL7 Expert',
        type: BikeType.RUTA,
        color: 'Carbon/Oil Slick',
        serialNumber: 'WSBC604022567N',
        photoUrl: 'https://example.com/tarmac-sl7.jpg',
        isActive: true,
        specs: {
            frameSize: '54',
            groupset: 'Shimano Ultegra Di2',
            wheels: 'Roval C38',
            weightKg: 7.2
        },
        // cyclistProfileId se asigna al insertar
    },

    // 2. MTB - Cross Country (Muy común)
    {
        brand: 'Scott',
        model: 'Spark RC World Cup',
        type: BikeType.MTB,
        color: 'Amarillo/Negro',
        serialNumber: 'STM2209384',
        photoUrl: 'https://example.com/scott-spark.jpg',
        isActive: true,
        specs: {
            frameSize: 'M',
            suspension: 'Full Suspension 120mm',
            groupset: 'SRAM XX1 Eagle AXS',
            wheelSize: '29"'
        },
    },

    // 3. GRAVEL - Aventura
    {
        brand: 'Canyon',
        model: 'Grizl CF SL 8',
        type: BikeType.GRAVEL,
        color: 'Matcha Splash',
        serialNumber: 'R093029384',
        photoUrl: null, // Sin foto
        isActive: true,
        specs: {
            frameSize: 'L',
            groupset: 'Shimano GRX 810',
            tires: 'Schwalbe G-One 45mm'
        },
    },

    // 4. E-BIKE - Eléctrica
    {
        brand: 'Orbea',
        model: 'Rise M10',
        type: BikeType.E_BIKE,
        color: 'Azul Cósmico',
        serialNumber: 'ORB9938221',
        photoUrl: 'https://example.com/orbea-rise.jpg',
        isActive: true,
        specs: {
            motor: 'Shimano EP8 RS',
            battery: '360Wh',
            range: '60km',
            frameSize: 'S'
        },
    },

    // 5. MTB - Rígida (Entrada/Entrenamiento)
    {
        brand: 'Trek',
        model: 'Marlin 8',
        type: BikeType.MTB,
        color: 'Rojo Radioactivo',
        serialNumber: 'WTU293840K',
        photoUrl: 'https://example.com/trek-marlin.jpg',
        isActive: true, // Aún activa
        specs: {
            frameSize: 'ML',
            suspension: 'RockShox Judy 100mm',
            groupset: 'SRAM SX Eagle',
            wheelSize: '29"'
        },
    },

    // 6. RUTA - Clásica / Antigua (Inactiva/Vendida)
    {
        brand: 'Pinarello',
        model: 'Dogma F8',
        type: BikeType.RUTA,
        color: 'Negro Mate',
        serialNumber: 'PIN102938',
        photoUrl: null,
        isActive: false, // Digamos que ya no la usa o la vendió
        specs: {
            frameSize: '56',
            groupset: 'Campagnolo Super Record',
            note: 'Vendida en 2023'
        },
    },

    // 7. BMX - Estilo libre
    {
        brand: 'Haro',
        model: 'Midway',
        type: BikeType.BMX,
        color: 'Cromado',
        serialNumber: 'HA992837',
        photoUrl: 'https://example.com/haro-bmx.jpg',
        isActive: true,
        specs: {
            topTube: '20.5"',
            brakes: 'U-Brake',
            pegs: 2
        },
    },
];
