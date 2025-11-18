import type { Response, Request as ExpressRequest } from 'express';

import {
    Body,
    Controller,
    HttpCode,
    Post,
    Res,
    UseGuards,
    ValidationPipe,
    Request,
    UnauthorizedException,
} from '@nestjs/common';

import { UserType } from '../../user/types/user.type';
import { LocalAuthGuard } from '../guards/local-auth.guards';
import { AuthInputDto, LoginDto } from '../models/auth-input.dto';
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
    async login(
        @Body() _dto: LoginDto,
        @Request() req: ExpressRequest,
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = req.user as UserType | undefined;

        if (!user) {
            throw new UnauthorizedException('User payload missing');
        }

        const { accessToken, refreshToken } = await this.authService.login(user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        return { accessToken };
    }
}
