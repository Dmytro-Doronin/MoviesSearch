import { Module } from '@nestjs/common';

import { CustomJwtModule } from '../../common/jwt-module/jwt.module';
import { IsUserAlreadyExistConstraint } from '../../common/validator/validation-login-password.validator';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { LocalAuthGuard } from './guards/local-auth.guards';
import { TokenRepository } from './repositories/token.repository';
import { AuthService } from './service/auth.service';
import { TokenService } from './service/token.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports: [UserModule, CustomJwtModule],
    controllers: [AuthController],
    providers: [
        LocalStrategy,
        LocalAuthGuard,
        AuthService,
        TokenRepository,
        TokenService,
        IsUserAlreadyExistConstraint,
    ],
    exports: [LocalStrategy, LocalAuthGuard, AuthService, TokenRepository, TokenService],
})
export class AuthModule {}
