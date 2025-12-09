import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TvController } from './controller/tv.controller';
import { TvService } from './service/tv.service';

@Module({
    imports: [HttpModule],
    providers: [TvService, ConfigService],
    controllers: [TvController],
    exports: [TvService, ConfigService],
})
export class TvModule {}
