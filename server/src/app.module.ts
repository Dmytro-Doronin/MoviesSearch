import { Module } from '@nestjs/common';

import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [AuthModule, UserModule, PrismaModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
