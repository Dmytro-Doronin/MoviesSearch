import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { MediaType, Movie, Prisma, TvShow, WishlistItem } from '@prisma/client';

import { PrismaService } from '../../../prisma/service/prisma.service';
import { WishlistResultItem, WishlistType } from '../types/wishlist.types';

@Injectable()
export class WishlistService {
    constructor(private prismaService: PrismaService) {}
    async addToWishlist(payload: WishlistType): Promise<WishlistItem> {
        const { userId, tmdbId, mediaType } = payload;

        try {
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
                select: { id: true },
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const existing = await this.prismaService.wishlistItem.findUnique({
                where: {
                    userId_tmdbId_mediaType: {
                        userId,
                        tmdbId,
                        mediaType,
                    },
                },
            });

            if (existing) {
                throw new BadRequestException('Item already in wishlist');
            }

            const lastItem = await this.prismaService.wishlistItem.findFirst({
                where: { userId },
                orderBy: { order: 'desc' },
            });

            const nextOrder = lastItem ? lastItem.order + 1 : 1;

            return await this.prismaService.wishlistItem.create({
                data: {
                    userId,
                    tmdbId,
                    mediaType,
                    order: nextOrder,
                },
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new BadRequestException('Item already in wishlist');
                }
            }

            if (e instanceof BadRequestException || e instanceof NotFoundException) {
                throw e;
            }

            throw new InternalServerErrorException('Failed to add to wishlist');
        }
    }

    async removeFromWishlist(userId: string, tmdbId: number, mediaType: MediaType) {
        try {
            await this.prismaService.wishlistItem.delete({
                where: {
                    userId_tmdbId_mediaType: {
                        userId,
                        tmdbId,
                        mediaType,
                    },
                },
            });

            return { success: true };
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    throw new NotFoundException('Wishlist item not found');
                }
            }

            throw new InternalServerErrorException('Failed to remove wishlist item');
        }
    }

    async getUserWishlist(userId: string): Promise<WishlistResultItem[]> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
                select: { id: true },
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const items = await this.prismaService.wishlistItem.findMany({
                where: { userId },
                orderBy: { order: 'asc' },
            });

            if (!items.length) {
                return [];
            }

            const movieIds = items
                .filter((item) => item.mediaType === MediaType.MOVIE)
                .map((item) => item.tmdbId);

            const tvIds = items
                .filter((item) => item.mediaType === MediaType.TV)
                .map((item) => item.tmdbId);

            const [movies, tvShows] = await Promise.all([
                movieIds.length
                    ? this.prismaService.movie.findMany({
                          where: { id: { in: movieIds } },
                      })
                    : Promise.resolve([] as Movie[]),
                tvIds.length
                    ? this.prismaService.tvShow.findMany({
                          where: { id: { in: tvIds } },
                      })
                    : Promise.resolve([] as TvShow[]),
            ]);

            const moviesMap = new Map<number, Movie>(
                movies.map((movie) => [movie.id, movie] as const),
            );

            const tvMap = new Map<number, TvShow>(tvShows.map((tv) => [tv.id, tv] as const));

            return items.map((item) => {
                const details =
                    item.mediaType === MediaType.MOVIE
                        ? (moviesMap.get(item.tmdbId) ?? null)
                        : (tvMap.get(item.tmdbId) ?? null);

                return {
                    ...item,
                    details,
                };
            });
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw e;
            }
            throw new InternalServerErrorException('Failed to fetch user wishlist');
        }
    }

    async reorderWishlist(
        userId: string,
        items: { id: string; order: number }[],
    ): Promise<WishlistItem[]> {
        if (!items.length) {
            return this.prismaService.wishlistItem.findMany({
                where: { userId },
                orderBy: { order: 'asc' },
            });
        }

        try {
            const ids = items.map((item) => item.id);

            const count = await this.prismaService.wishlistItem.count({
                where: {
                    userId,
                    id: { in: ids },
                },
            });

            if (count !== ids.length) {
                throw new BadRequestException('Some wishlist items do not belong to this user');
            }

            await this.prismaService.$transaction(
                items.map((item) =>
                    this.prismaService.wishlistItem.update({
                        where: { id: item.id },
                        data: { order: item.order },
                    }),
                ),
            );

            return this.prismaService.wishlistItem.findMany({
                where: { userId },
                orderBy: { order: 'asc' },
            });
        } catch (e) {
            if (e instanceof BadRequestException || e instanceof NotFoundException) {
                throw e;
            }

            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') {
                    throw new NotFoundException('One or more wishlist items not found');
                }
            }

            throw new InternalServerErrorException('Failed to reorder wishlist');
        }
    }
}
