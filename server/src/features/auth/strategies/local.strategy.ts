import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { UserType } from '../../user/types/user.type';
import { UserDoesNotExistsException } from '../exceptions/input-data.exceptions';
import { AuthService } from '../service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string): Promise<UserType> {
        const user = await this.authService.validateUser(email, password);

        if (!user) {
            throw new UserDoesNotExistsException('Invalid email or password');
        }

        return {
            id: user.id,
            login: user.login,
            email: user.email,
            imageUrl: user.imageUrl ?? null,
        };
    }
}
