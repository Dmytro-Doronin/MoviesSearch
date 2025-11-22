import { Module } from '@nestjs/common';

import { CustomJwtModule } from '../../common/jwt-module/jwt.module';
import { IsUserAlreadyExistConstraint } from '../../common/validator/validation-login-password.validator';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TokenRepository } from './repositories/token.repository';
import { AuthService } from './service/auth.service';
import { TokenService } from './service/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [UserModule, CustomJwtModule],
    controllers: [AuthController],
    providers: [
        LocalStrategy,
        LocalAuthGuard,
        AuthService,
        JwtStrategy,
        JwtAuthGuard,
        TokenRepository,
        TokenService,
        IsUserAlreadyExistConstraint,
    ],
    exports: [
        LocalStrategy,
        LocalAuthGuard,
        AuthService,
        TokenRepository,
        TokenService,
        JwtAuthGuard,
    ],
})
export class AuthModule {}
