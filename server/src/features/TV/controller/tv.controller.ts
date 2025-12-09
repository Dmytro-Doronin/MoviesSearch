import { Controller, Get, Query } from '@nestjs/common';

import { TvService } from '../service/tv.service';

@Controller('/tv')
export class TvController {
    constructor(private readonly tvService: TvService) {}

    @Get()
    async getAllTvController(
        @Query('sortBy') sortBy: string,
        @Query('sortDirection') sortDirection: 'asc' | 'desc',
        @Query('page') page: string,
    ) {
        return await this.tvService.getTv({
            page: Number(page) || 1,
            sortBy,
            sortDirection,
        });
    }
}
