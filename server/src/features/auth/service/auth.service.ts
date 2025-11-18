import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { CustomJwtService } from '../../../common/jwt-module/service/jwt.service';
import { CreateUserDto } from '../../user/models/create-user.dto';
import { UserQueryRepository } from '../../user/repositories/userQuery.repository';
import { UserService } from '../../user/service/user.service';
import { UserType } from '../../user/types/user.type';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private userQueryRepository: UserQueryRepository,
        private jwtService: CustomJwtService,
        private tokenService: TokenService,
    ) {}

    async registration({ login, password, email }: CreateUserDto) {
        const user: CreateUserDto & { imageUrl: null | string } = {
            login,
            password,
            email,
            imageUrl: null,
        };

        return await this.userService.createUser(user);
    }

    async login(user: UserType) {
        const { accessToken, refreshToken } = await this.createJWT(user);
        await this.tokenService.saveRefreshToken(user.id, refreshToken);
        return { accessToken, refreshToken };
    }

    async validateUser(email: string, password: string) {
        const user = await this.userQueryRepository.findByEmail(email);
        if (!user) {
            return null;
        }

        const passwordHash = await this._generateHash(password, user.passwordSalt);
        return user.passwordHash === passwordHash ? user : null;
    }

    async createJWT(user: UserType) {
        const { refreshToken, accessToken } = await this.jwtService.createJWT(user);
        return { accessToken, refreshToken };
    }

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    }
}
