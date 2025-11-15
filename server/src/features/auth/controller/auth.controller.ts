import { Body, Controller, HttpCode, Post, ValidationPipe } from '@nestjs/common';

import { AuthInputDto } from '../models/auth-input.dto';
import { AuthService } from '../service/auth.service';

@Controller('/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(204)
    @Post('/registration')
    async registration(@Body(new ValidationPipe()) authInputDto: AuthInputDto) {
        await this.authService.registration({
            login: authInputDto.login,
            password: authInputDto.password,
            email: authInputDto.email,
        });
    }
}
