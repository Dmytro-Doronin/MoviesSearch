import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

import { mapAxiosToHttp } from '../../../common/http/upstream-error.mapper';
import { TMDB_API_BASE_URL } from '../../movie/constants/tmdb.constants';
import { moviesMapping } from '../../movie/models/movie-output.model';
import { TMDBResponse, TMDBTv } from '../types/tv.types';

@Injectable()
export class TvService {
    private readonly baseUrl = TMDB_API_BASE_URL;
    private readonly apiKey = process.env.TMDB_BEARER_TOKEN ?? '';
    constructor(private readonly httpService: HttpService) {}

    async getTv(query: { page?: number; sortBy?: string; sortDirection?: 'asc' | 'desc' }) {
        try {
            const response: AxiosResponse<TMDBResponse<TMDBTv>> = await firstValueFrom(
                this.httpService.get<TMDBResponse<TMDBTv>>(`${this.baseUrl}/discover/tv`, {
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
}
