import {
    Body,
    Controller,
    HttpCode,
    Post,
    Res,
    UseGuards,
    ValidationPipe,
    Request,
} from '@nestjs/common';
import { Response } from 'express';

import { LocalAuthGuard } from '../guards/local-auth.guards';
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

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req, @Res() res: Response) {
        const { accessToken, refreshToken } = await this.authService.login(req.user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        res.status(200).json({ accessToken });
    }
}
