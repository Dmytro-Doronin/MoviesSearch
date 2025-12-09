export interface TMDBResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export interface TMDBTv {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    poster_path: string | null;
    backdrop_path: string | null;
    popularity: number;
    vote_average: number;
    vote_count: number;
}

export interface TMDBTvSearch {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    original_language: string;
    popularity: number;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    adult: boolean;
    video: boolean;
}

export interface TMDBTVSearch {
    id: number;
    name: string;
    original_name: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    first_air_date: string;
    original_language: string;
    popularity: number;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    origin_country: string[];
}
export type MixedTvItem = TMDBTvSearch | TMDBTVSearch;
