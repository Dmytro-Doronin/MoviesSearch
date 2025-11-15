import { Injectable } from '@nestjs/common';

import { CreateUserDto } from '../../user/models/create-user.dto';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    async registration({ login, password, email }: CreateUserDto) {
        const user: CreateUserDto & { imageUrl: null | string } = {
            login,
            password,
            email,
            imageUrl: null,
        };

        return await this.userService.createUser(user);
    }
}
