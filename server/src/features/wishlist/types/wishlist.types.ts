import { MediaType, Movie, TvShow, WishlistItem } from '@prisma/client';

export type WishlistType = {
    userId: string;
    tmdbId: number;
    mediaType: MediaType;
};

export type WishlistResultItem = WishlistItem & {
    details: Movie | TvShow | null;
};
