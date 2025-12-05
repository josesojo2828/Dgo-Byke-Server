import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import { UserService } from '../../modules/user/services/user.service'; // Ajusta la ruta si es necesario
import { DashboardService } from 'src/modules/dashboard/dashboard.service';

@Injectable()
export class InjectUserInterceptor implements NestInterceptor {
    // 1. Inyecta UserService
    constructor(
        private userService: UserService,
        private dashboardService: DashboardService
    ) { }
    

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        const request = context.switchToHttp().getRequest<FastifyRequest>();

        // 2. Obtén el userId de la sesión (como en tu SessionAuthGuard)
        const userId = (request.session as any).get('userId');


        if (!userId) {
            return next.handle();
        }


        
        return new Observable(observer => {
            this.userService.findOneById(userId)
                .then(user => {
                    next.handle().pipe(
                        map((data) => {
                            if (user && data && typeof data === 'object' && !Array.isArray(data)) {
                                const sidebar = this.dashboardService.getSidebarSections({ id: user.id, permits: user.permits.list});
                                return {
                                    ...data,
                                    user: user,
                                    sidebar,
                                };
                            }
                            return data;
                        })
                    ).subscribe(observer);
                })
                .catch(error => {
                    console.error("InjectUserInterceptor: Error fetching user:", error);
                    next.handle().subscribe(observer);
                });
        });
    }
}

