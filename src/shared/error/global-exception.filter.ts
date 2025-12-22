// src/shared/error/global-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    let errorMessage = 'Error desconocido';
    if (typeof exceptionResponse === 'string') {
      errorMessage = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && (exceptionResponse as any).message) {
      const msg = (exceptionResponse as any).message;
      errorMessage = Array.isArray(msg) ? msg[0] : msg;
    }

    const acceptHeader = request.headers.accept || '';

    const wantsJson = acceptHeader.includes('application/json');
    const wantsHtml = acceptHeader.includes('text/html');

    const isApiRequest = wantsJson || (request.url.startsWith('/api') && !wantsHtml);

    // if (isApiRequest) {
    const errorResponse = {
      success: false,
      statusCode: status,
      error: {
        code: (exception as any).code || 'INTERNAL_ERROR', // Prisma codes or others
        message: errorMessage,
        path: request.url,
        timestamp: new Date().toISOString(),
      }
    };

    response.status(status).send(errorResponse);

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`🔥 ERROR 500 en ${request.url}:`);
      console.error(exception);
    }
    //   } else {

    //     if ((request as any).flash) {
    //       (request as any).flash('error', errorMessage);
    //     }
    //     const referer = request.headers.referer;

    //     if (referer) {
    //       response.status(303).redirect(referer); // 303 See Other es mejor para form submissions
    //     } else {
    //       // Fallback si no hay referer
    //       response.status(303).redirect('/dashboard');
    //     }
    //   }
  }
}