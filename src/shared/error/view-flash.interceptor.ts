import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyReply } from 'fastify'; // <--- IMPORTANTE: Usar FastifyReply

@Injectable()
export class ViewFlashInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        // En fastify-flash, el método suele vivir en 'reply' (response)
        const response = ctx.getResponse<FastifyReply>();

        // SOLUCIÓN: Hacemos un cast a 'any' para evitar el error TS2555.
        // Aunque el tipo dice que requiere argumentos, en runtime funciona vacío para GET.
        const flashMessages = (response.flash as any)
            ? (response.flash as any)()
            : {};

        return next.handle().pipe(
            map((data) => {
                if (data && typeof data === 'object') {
                    return {
                        ...data,
                        flash: flashMessages,
                    };
                }
                return data;
            }),
        );
    }
}