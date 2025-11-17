import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

import { UserType } from '../../../features/user/types/user.type';

@Injectable()
export class CustomJwtService {
    constructor(private jwtService: JwtService) {}

    async createJWT(user: UserType, deviceId: string = uuidv4()) {
        const payloadBase = {
            sub: user.id,
            deviceId,
        };

        const accessToken = this.jwtService.sign(payloadBase, {
            expiresIn: '1h',
        });

        const refreshToken = this.jwtService.sign(payloadBase, {
            expiresIn: '7d',
        });

        return { accessToken, refreshToken };
    }

    verifyRefreshToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    async getUserIdByToken(token: string) {
        try {
            const result = this.jwtService.verify(token);
            return result.sub;
        } catch {
            return false;
        }
    }
}
