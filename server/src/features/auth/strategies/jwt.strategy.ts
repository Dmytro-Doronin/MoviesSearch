import type { JwtFromRequestFunction } from 'passport-jwt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { jwtConstants } from '../../../common/constants/jwt-constants';
import { JwtPayload } from '../../../common/jwt-module/types/jwt.types';
import { UserQueryRepository } from '../../user/repositories/userQuery.repository';

type RequestWithCookies = {
    cookies?: Record<string, string>;
    headers?: Record<string, string | string[] | undefined>;
};

const cookieJwtExtractor = (cookieName: string): JwtFromRequestFunction => {
    return (req: RequestWithCookies): string | null => {
        return req.cookies?.[cookieName] ?? null;
    };
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userQueryRepository: UserQueryRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                cookieJwtExtractor('accessToken'),
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userQueryRepository.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }
        return { userId: payload.sub };
    }
}
