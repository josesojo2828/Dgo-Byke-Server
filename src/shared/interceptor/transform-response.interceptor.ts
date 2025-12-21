import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from '../interface/response.interface';

@Injectable()
export class TransformResponseInterceptor<T>
    implements NestInterceptor<T, IResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<IResponse<T>> {
        return next.handle().pipe(
            map((data) => {
                // Si el controlador ya devuelve un objeto con { success: ... }, lo pasamos tal cual (prevención doble wrap)
                if (data && typeof data === 'object' && 'success' in data) {
                    return data as IResponse<T>;
                }

                // Estructura base
                const response: IResponse<T> = {
                    success: true,
                    data: data,
                };

                // Si la data incluye metadata de paginación o mensaje, los extraemos
                if (data && data.meta) {
                    response.meta = data.meta;
                    delete data.meta;
                }

                // Si es un objeto paginado tipo { data: [], total: ... }
                // Se debería adoptar convención, pero por ahora envolvemos directo.

                return response;
            }),
        );
    }
}
