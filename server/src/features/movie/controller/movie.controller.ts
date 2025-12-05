import { Controller, ForbiddenException, Get, Param, Query } from '@nestjs/common';

import { MovieService } from '../service/movie.service';

@Controller('/movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Get()
    async getAllMoviesController(
        @Query('sortBy') sortBy: string,
        @Query('sortDirection') sortDirection: 'asc' | 'desc',
        @Query('page') page: string,
    ) {
        return await this.movieService.getMovies({
            page: Number(page) || 1,
            sortBy,
            sortDirection,
        });
    }

    @Get('/rated')
    async getRatedMoviesController(@Query('page') page: string) {
        return await this.movieService.getRatedMovies({
            page: Number(page) || 1,
        });
    }

    @Get('/search')
    async getMoviesSearch(
        @Query('queryString') queryString: string,
        @Query('limit') limit: number,
        @Query('page') page: string,
    ) {
        return await this.movieService.searchByTerm({
            page: Number(page) || 1,
            limit: limit || 8,
            queryString: queryString || '',
        });
    }

    @Get('/:id')
    async getMovieController(@Param('id') movieId: string) {
        return await this.movieService.getMovieById(movieId);
    }

    @Get('/trailer/:id')
    async getMovieTrailerController(@Param('id') movieTrailerId: string) {
        const trailerUrl = await this.movieService.getMovieTrailer(movieTrailerId);

        if (!trailerUrl) {
            throw new ForbiddenException('There is no trailer');
        }

        return trailerUrl;
    }

    @Get('/:id/actors')
    async getActorsForMovieController(@Param('id') movieId: string) {
        const actors = await this.movieService.getMovieActors(movieId);

        if (!actors) {
            throw new ForbiddenException('There is no actors');
        }

        return actors;
    }
}
