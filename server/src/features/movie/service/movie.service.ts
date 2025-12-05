import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

import { mapAxiosToHttp } from '../../../common/http/upstream-error.mapper';
import { TMDB_API_BASE_URL } from '../constants/tmdb.constants';
import { movieActorsMapping, movieMapping, moviesMapping } from '../models/movie-output.model';
import {
    MixedItem,
    MovieDetails,
    TMDBMovie,
    TMDBMovieActor,
    TMDBMovieActorsResponse,
    TMDBMovieSearch,
    TMDBMovieTrailerInfoResponse,
    TMDBResponse,
    TMDBTVSearch,
} from '../types/movie.types';
@Injectable()
export class MovieService {
    private readonly baseUrl = TMDB_API_BASE_URL;
    private readonly apiKey = process.env.TMDB_BEARER_TOKEN ?? '';
    constructor(private readonly httpService: HttpService) {}

    async getMovies(query: { page?: number; sortBy?: string; sortDirection?: 'asc' | 'desc' }) {
        try {
            const response: AxiosResponse<TMDBResponse<TMDBMovie>> = await firstValueFrom(
                this.httpService.get<TMDBResponse<TMDBMovie>>(`${this.baseUrl}/discover/movie`, {
                    params: {
                        include_adult: 'false',
                        include_video: 'true',
                        language: 'en-US',
                        page: query.page ?? 1,
                        sort_by: query.sortBy
                            ? `${query.sortBy}.${query.sortDirection ?? 'desc'}`
                            : 'popularity.desc',
                    },
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                    timeout: 10000,
                }),
            );

            return moviesMapping(response.data);
        } catch (e) {
            mapAxiosToHttp(e, 'TMDB');
        }
    }

    async getRatedMovies(query: { page?: number }) {
        try {
            const response: AxiosResponse<TMDBResponse<TMDBMovie>> = await firstValueFrom(
                this.httpService.get<TMDBResponse<TMDBMovie>>(`${this.baseUrl}/movie/top_rated`, {
                    params: {
                        language: 'en-US',
                        page: query.page ?? 1,
                    },
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                    timeout: 10000,
                }),
            );

            return moviesMapping<TMDBMovie>(response.data, { limit: 10 });
        } catch (e) {
            mapAxiosToHttp(e, 'TMDB');
        }
    }

    async searchByTerm(query: { queryString: string; page?: number; limit: number }) {
        try {
            const term = query.queryString?.trim();
            if (!term) {
                return { results: [] as MixedItem[] };
            }

            const params = {
                query: term,
                page: query.page ?? 1,
                include_adult: 'false',
                language: 'en-US',
            } as const;

            const [moviesRes, tvRes]: [
                AxiosResponse<TMDBResponse<TMDBMovieSearch>>,
                AxiosResponse<TMDBResponse<TMDBTVSearch>>,
            ] = await Promise.all([
                firstValueFrom(
                    this.httpService.get<TMDBResponse<TMDBMovieSearch>>(
                        `${this.baseUrl}/search/movie`,
                        {
                            params,
                            headers: {
                                accept: 'application/json',
                                Authorization: `Bearer ${this.apiKey}`,
                            },
                            timeout: 8000,
                        },
                    ),
                ),
                firstValueFrom(
                    this.httpService.get<TMDBResponse<TMDBTVSearch>>(`${this.baseUrl}/search/tv`, {
                        params,
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${this.apiKey}`,
                        },
                        timeout: 8000,
                    }),
                ),
            ]);

            const mappedMovies = moviesMapping<TMDBMovieSearch>(moviesRes.data);
            const mappedTV = moviesMapping<TMDBTVSearch>(tvRes.data);

            const movies = mappedMovies.results ?? [];
            const tv = mappedTV.results ?? [];

            const merged: MixedItem[] = [...movies, ...tv].slice(0, query.limit);
            return { results: merged };
        } catch (e) {
            mapAxiosToHttp(e, 'TMDB');
        }
    }

    async getMovieById(id: string): Promise<MovieDetails> {
        const params = {
            language: 'en-US',
        } as const;

        try {
            const response: AxiosResponse<MovieDetails> = await firstValueFrom(
                this.httpService.get<MovieDetails>(`${this.baseUrl}/movie/${id}`, {
                    params,
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                    timeout: 10000,
                }),
            );
            return movieMapping(response.data);
        } catch (e) {
            mapAxiosToHttp(e, 'TMDB');
        }
    }

    async getTvById(id: string): Promise<MovieDetails> {
        const params = {
            language: 'en-US',
        } as const;

        try {
            const response: AxiosResponse<MovieDetails> = await firstValueFrom(
                this.httpService.get<MovieDetails>(`${this.baseUrl}/movie/${id}`, {
                    params,
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                    timeout: 10000,
                }),
            );
            return movieMapping(response.data);
        } catch (e) {
            mapAxiosToHttp(e, 'TMDB');
        }
    }

    async getMovieTrailer(id: string): Promise<string | null> {
        const params = {
            language: 'en-US',
        } as const;

        try {
            const response: AxiosResponse<TMDBMovieTrailerInfoResponse> = await firstValueFrom(
                this.httpService.get<TMDBMovieTrailerInfoResponse>(
                    `${this.baseUrl}/movie/${id}/videos`,
                    {
                        params,
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${this.apiKey}`,
                        },
                        timeout: 10000,
                    },
                ),
            );
            const trailer = response.data.results.find(
                (video: { type: string; site: string }) =>
                    video.type === 'Trailer' && video.site === 'YouTube',
            );

            if (trailer) {
                return `https://www.youtube.com/embed/${trailer.key}`;
            } else {
                return null;
            }
        } catch (e) {
            mapAxiosToHttp(e, 'TMDB');
        }
    }

    async getMovieActors(id: string): Promise<TMDBMovieActor[] | null> {
        const params = {
            language: 'en-US',
        } as const;

        try {
            const response: AxiosResponse<TMDBMovieActorsResponse> = await firstValueFrom(
                this.httpService.get<TMDBMovieActorsResponse>(
                    `${this.baseUrl}/movie/${id}/credits`,
                    {
                        params,
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${this.apiKey}`,
                        },
                        timeout: 10000,
                    },
                ),
            );

            return response.data.cast.map(movieActorsMapping);
        } catch (e) {
            mapAxiosToHttp(e, 'TMDB');
        }
    }
}
