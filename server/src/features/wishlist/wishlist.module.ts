import { Module } from '@nestjs/common';

import { UserQueryRepository } from '../user/repositories/userQuery.repository';
import { WishlistController } from './controllers/wishlist.controller';

@Module({
    imports: [],
    controllers: [WishlistController],
    providers: [UserQueryRepository],
    exports: [UserQueryRepository],
})
export class WishlistModule {}
