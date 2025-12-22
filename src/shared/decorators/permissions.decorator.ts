import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: string[]) => {
    console.log('require', permissions);
    return SetMetadata(PERMISSIONS_KEY, permissions);
}

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        console.log('permitidos', request.user);
        return request.user;
    },
);
