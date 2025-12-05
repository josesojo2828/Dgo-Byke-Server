import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const next = context.switchToHttp().getNext();

    const isAuthenticated = request.isAuthenticated();

    if (!isAuthenticated) {
      // 1. Set the flash message key in the session
      request.session.set('flash_error', 'auth.must_login'); // Using a translation key

      // 2. Redirect (using Fastify syntax)
      response.redirect('/login', 302); // Redirect to your actual login route
      return false;
    }
    return true;
  }
}