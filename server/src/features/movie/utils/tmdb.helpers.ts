import { TMDB_IMAGE_BASE_URL } from '../constants/tmdb.constants';

export function buildImageUrl(path: string | null, size: string = 'w500'): string | null {
    return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null;
}
