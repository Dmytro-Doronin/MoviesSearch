import { Module } from '@nestjs/common';

import { UserQueryRepository } from './repositories/userQuery.repository';
import { UserService } from './service/user.service';

@Module({
    imports: [],
    controllers: [],
    providers: [UserService, UserQueryRepository],
    exports: [UserService, UserQueryRepository],
})
export class UserModule {}
