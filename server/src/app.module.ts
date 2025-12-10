import { Module } from '@nestjs/common';

import { CustomJwtModule } from './common/jwt-module/jwt.module';
import { AuthModule } from './features/auth/auth.module';
import { MovieModule } from './features/movie/movie.module';
import { TvModule } from './features/TV/tv.module';
import { UserModule } from './features/user/user.module';
import { WishlistModule } from './features/wishlist/wishlist.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        PrismaModule,
        CustomJwtModule,
        MovieModule,
        TvModule,
        WishlistModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
