import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../modules/user/service/user.service';
import { PrismaService } from '../shared/service/prisma.service';

/*
 * PLAYGROUND SCRIPT
 * -----------------
 * Use this script to run ad-hoc logic within the NestJS application context.
 * Perfect for maintenance tasks, quick data fixes, or testing flows manually.
 * 
 * Usage: npm run playground
 */

async function bootstrap() {
    // 1. Initialize Full App (Needed for Swagger to scan routes)
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn'], // Less noise
    });

    try {
        console.log('--- PLAYGROUND STARTED ---');

        // 2. Retrieve Services
        // const userService = app.get(UserService);
        // const prisma = app.get(PrismaService);
        const userService = app.get(UserService);

        // 3. Your Logic Here
        console.log('Fetching user count...');
        const allUsers = await userService.findAll({  });
        console.log(`Found ${allUsers.length} users in the first page.`);

        // --- NEW: Generate OpenAPI Spec ---
        console.log('Generating OpenAPI Spec...');
        const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
        const fs = require('fs');
        const path = require('path');

        const config = new DocumentBuilder()
            .setTitle('DgoByke Platform API')
            .setDescription('The DgoByke API description')
            .setVersion('1.0')
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(app, config);
        const outputPath = path.resolve(process.cwd(), 'api-spec.json');
        fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
        console.log(`OpenAPI Spec generated at: ${outputPath}`);
        // ----------------------------------

        // Example: Create a test race (Commented out)
        /*
        const raceService = app.get(RaceService);
        await raceService.create({ ... });
        */

        console.log('--- PLAYGROUND FINISHED ---');
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await app.close();
    }
}

bootstrap();
