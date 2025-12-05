import { MovieDetails, TMDBMovieActor, TMDBResponse } from '../types/movie.types';
import { buildImageUrl } from '../utils/tmdb.helpers';

type WithImages = {
    poster_path: string | null;
    backdrop_path: string | null;
};

export function moviesMapping<T extends WithImages>(
    data: TMDBResponse<T>,
    { limit }: { limit?: number } = {},
): TMDBResponse<T> {
    const max = limit ?? data.results.length;

    return {
        ...data,
        results: data.results.slice(0, max).map((movie) => ({
            ...movie,
            poster_path: buildImageUrl(movie.poster_path, 'w500'),
            backdrop_path: buildImageUrl(movie.backdrop_path, 'w780'),
        })),
    };
}

export function movieMapping(data: MovieDetails): MovieDetails {
    return {
        ...data,
        poster_path: buildImageUrl(data.poster_path, 'w500'),
        backdrop_path: buildImageUrl(data.backdrop_path, 'w1280'),
    };
}

export function movieActorsMapping(data: TMDBMovieActor): TMDBMovieActor {
    return {
        ...data,
        profile_path: buildImageUrl(data.profile_path, 'w500'),
    };
}
