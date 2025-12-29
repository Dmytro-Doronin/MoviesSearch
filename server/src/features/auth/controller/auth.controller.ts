import type { Response } from 'express';

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
    NotFoundException,
    Get,
} from '@nestjs/common';

import type { AccessUserPayload, LocalUserPayload, RefreshUserPayload } from '../types/auth.types';

import { VerifyRefreshTokenGuard } from '../../../common/jwt-module/guards/verify-token.guard';
import { UserQueryRepository } from '../../user/repositories/userQuery.repository';
import { UserType } from '../../user/types/user.type';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthInputDto, LoginDto } from '../models/auth-input.dto';
import { AuthService } from '../service/auth.service';

@Controller('/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userQueryRepository: UserQueryRepository,
    ) {}

    @HttpCode(204)
    @Post('/registration')
    async registration(@Body(new ValidationPipe()) authInputDto: AuthInputDto) {
        await this.authService.registration({
            login: authInputDto.login,
            password: authInputDto.password,
            email: authInputDto.email,
        });
    }

    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(
        @Body() _dto: LoginDto,
        @Request() req: LocalUserPayload,
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

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post('/logout')
    async logout(@Request() req: AccessUserPayload, @Res() res: Response) {
        await this.authService.logout(req.user.userId);
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.sendStatus(204);
    }

    @HttpCode(200)
    @UseGuards(VerifyRefreshTokenGuard)
    @Post('/refresh-token')
    async refresh(@Request() req: RefreshUserPayload, @Res() res: Response) {
        const refreshToken = req.user.refreshToken;
        const userId = req.user.id;

        const { accessToken, refreshToken: newToken } = await this.authService.refresh(
            userId,
            refreshToken,
        );

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        res.cookie('refreshToken', newToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('/me')
    async me(@Request() req: AccessUserPayload) {
        const userId = req.user.userId;
        const user = await this.userQueryRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User was not found');
        }

        return {
            id: userId,
            email: user.email,
            login: user.login,
            imageUrl: user.imageUrl,
        };
    }
}
