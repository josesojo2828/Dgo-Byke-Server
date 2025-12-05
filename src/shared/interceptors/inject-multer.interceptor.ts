import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class InjectUserInterceptor implements NestInterceptor {
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    
    // 1. Obtenemos la solicitud (request)
    const request = context.switchToHttp().getRequest();

    // 2. Comprobamos si la ruta es una API
    //    (Asumiendo que todas tus rutas JSON empiezan con /api/)
    if (request.path && request.path.startsWith('/api/')) {
      
      // 3. ¡SÍ ES UNA API!
      // No hacemos nada de Handlebars y simplemente pasamos a lo siguiente
      // (que será tu FileInterceptor).
      return next.handle();
    }

    // 4. NO ES UNA API
    // Esta es una ruta normal que renderiza HTML,
    // así que ejecutamos tu lógica de Handlebars.
    // (Este código es un ejemplo, pon tu lógica real aquí)
    
    // const response = context.switchToHttp().getResponse();
    // response.locals.myHelper = () => { ... };
    // response.locals.myPartial = '...';
    // if (request.user) {
    //   response.locals.user = request.user;
    // }

    // Tu lógica actual para Handlebars va aquí...


    // 5. Continuamos con la solicitud
    return next.handle();
  }
}