import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

import * as handlebars from 'handlebars';
import * as path from 'path';
import { I18nService } from 'nestjs-i18n';

import { registerHandlebarsHelpers } from './shared/helpers/handlebars.registry';
import { registerPartialsRecursive } from './shared/helpers/partials.registry';
import { MvcLangInjectorInterceptor } from './shared/interceptors/inject-lang.interceptor';
import { fastifyMultipart } from '@fastify/multipart';

// Solo necesitas cookie y session para la persistencia manual
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import { GlobalExceptionFilter } from './shared/error/global-exception.filter';

import fastifyFlash from '@fastify/flash';
import { ViewFlashInterceptor } from './shared/error/view-flash.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 1024 * 1024 * 30, // 30 MB
    }),
  );

  // --- CONFIGURACIÓN CORS (AGREGA ESTO) ---
  app.enableCors({
    origin: ['http://localhost:3000','http://localhost:7002'], // Dominios permitidos (Tu frontend)
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

  // --- INTERCEPTOR Y HELPERS ---
  app.useGlobalInterceptors(new MvcLangInjectorInterceptor());
  app.useGlobalInterceptors(new ViewFlashInterceptor());
  // app.useGlobalInterceptors(new InjectUserInterceptor());

  const i18nService = app.get(I18nService);
  registerHandlebarsHelpers(handlebars, i18nService as any);
  // --- FIN INTERCEPTOR Y HELPERS ---


  // --- CONFIGURACIÓN DE VISTAS Y ASSETS (Esto sigue igual) ---
  app.useStaticAssets({
    root: path.join(process.cwd(), 'public'),
    prefix: '/public/',
  });

  const partialsDir = path.join(process.cwd(), 'views/partials');
  registerPartialsRecursive(partialsDir); // O usa la opción 'partials' en setViewEngine

  app.setViewEngine({
    engine: {
      handlebars: handlebars,
    },
    templates: path.join(process.cwd(), 'views'),
    layout: 'index',
    // Opcional (si quitaste registerPartialsRecursive):
    // partials: partialsDir,
  });
  // --- FIN CONFIGURACIÓN DE VISTAS ---

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();