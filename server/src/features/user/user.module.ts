import { Module } from '@nestjs/common';

import { IsUserAlreadyExistConstraint } from '../../common/validator/validation-login-password.validator';
import { UserQueryRepository } from './repositories/userQuery.repository';
import { UserService } from './service/user.service';

@Module({
    imports: [],
    controllers: [],
    providers: [UserService, UserQueryRepository, IsUserAlreadyExistConstraint],
    exports: [UserService, UserQueryRepository, IsUserAlreadyExistConstraint],
})
export class UserModule {}
