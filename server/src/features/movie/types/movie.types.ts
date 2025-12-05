export interface TMDBResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export interface TMDBMovie {
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

export type MovieDetails = {
    adult: boolean;
    backdrop_path: string | null;
    belongs_to_collection?: string;
    budget: number;
    genres: {
        id: number;
        name: string;
    }[];
    homepage: string;
    id: number;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    production_companies: {
        id: number;
        logo_path: string;
        name: string;
        origin_country: string;
    }[];
    production_countries: {
        iso_3166_1: string;
        name: string;
    }[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: {
        english_name: string;
        iso_639_1: string;
        name: string;
    }[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
};

export interface TMDBMovieSearch {
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
export type MixedItem = TMDBMovieSearch | TMDBTVSearch;

export interface TMDBMovieTrailerInfo {
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    key: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
    id: string;
}

export interface TMDBMovieTrailerInfoResponse {
    id: number;
    results: TMDBMovieTrailerInfo[];
}

export interface TMDBMovieActor {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
}

export interface TMDBMovieActorsResponse {
    id: number;
    cast: TMDBMovieActor[];
}
