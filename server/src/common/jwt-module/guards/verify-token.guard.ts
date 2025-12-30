import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { CustomJwtService } from '../service/jwt.service';

@Injectable()
export class VerifyRefreshTokenGuard implements CanActivate {
    constructor(private readonly jwtService: CustomJwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) throw new UnauthorizedException('No refresh token');

        try {
            const payload = this.jwtService.verifyRefreshToken(refreshToken);
            req.user = { id: payload.sub, refreshToken };
            return true;
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
