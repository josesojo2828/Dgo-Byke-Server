import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as path from 'path';
import { fastifyMultipart } from '@fastify/multipart';

import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import { GlobalExceptionFilter } from './shared/error/global-exception.filter';

import fastifyFlash from '@fastify/flash';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 1024 * 1024 * 30, // 30 MB
    }),
  );

  // --- CONFIGURACIÓN CORS (AGREGA ESTO) ---
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:7002'], // Dominios permitidos (Tu frontend)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true, // Importante si usas cookies o headers de autorización
  });
  // --- FIN CONFIGURACIÓN CORS ---

  const secret = process.env.SESSION_SECRET || 'YourVeryLongSecureSecretKeyMustBeAtLeast32Characters';

  // --- REGISTRO DE PLUGINS ESENCIALES ---
  await app.register(fastifyCookie);
  await app.register(fastifySession, {
    secret,
    cookie: {
      secure: false, // Poner en 'true' en producción (HTTPS)
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
      path: '/',
    },
    saveUninitialized: false, // Recomendado
  });
  await app.register(fastifyFlash);
  // --- FIN REGISTRO DE PLUGINS ---

  await app.register(fastifyMultipart);

  // --- CONFIGURACIÓN DE VISTAS Y ASSETS (Esto sigue igual) ---
  app.useStaticAssets({
    root: path.join(process.cwd(), 'public'),
    prefix: '/public/',
  });

  // --- CONFIGURACIÓN SWAGGER (Documentación) ---
  const config = new DocumentBuilder()
    .setTitle('DgoByke Platform API')
    .setDescription('The DgoByke API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  // --- FIN CONFIGURACIÓN SWAGGER ---

  // --- VALIDACIÓN GLOBAL ---
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades no definidas en los DTO
    forbidNonWhitelisted: true, // Lanza error si llegan propiedades extra
    transform: true, // Transforma payloads a instancias de DTO
  }));
  // --- FIN VALIDACIÓN GLOBAL ---

  app.useGlobalFilters(new GlobalExceptionFilter());
  const PORT = process.env.PORT ?? 3001;

  console.log(`Server running on port ${PORT}`);
  await app.listen(PORT, '0.0.0.0');
}
bootstrap();