import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserModule } from '../user/user.module';
import { MovieController } from './controller/movie.controller';
import { MovieService } from './service/movie.service';
@Module({
    imports: [UserModule, HttpModule],
    providers: [MovieService, ConfigService],
    controllers: [MovieController],
    exports: [MovieService, ConfigService],
})
export class MovieModule {}
