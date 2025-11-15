import { Module } from '@nestjs/common';

import { IsUserAlreadyExistConstraint } from '../../common/validator/validation-login-password.validator';
import { AuthController } from './controller/auth.controller';

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [IsUserAlreadyExistConstraint],
    exports: [],
})
export class AuthModule {}
