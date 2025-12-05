import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyRequest } from 'fastify'; // Importa el tipo de Request

@Injectable()
export class MvcLangInjectorInterceptor implements NestInterceptor {

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const queryLang = (request.query as any)?.lang;
    const headerLang = request.headers['accept-language']?.split(',')[0].split('-')[0];

    const lang = 'es'; // Tu fallback

    (request as any).lang = lang;

    return next.handle().pipe(
      map((data) => {
        // 'data' es lo que tu controlador retornó (ej: { message: '...' })

        // 4. Inyectamos 'lang' en la respuesta
        // Nos aseguramos de que 'data' sea un objeto
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          return {
            ...data,
            lang: lang,
          };
        }

        return data;
      }),
    );
  }
}