import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/service/prisma.service';

@Injectable()
export class TokenRepository {
    constructor(private prisma: PrismaService) {}

    async saveRefreshToken(userId: string, token: string) {
        const result = await this.prisma.refreshToken.upsert({
            where: {
                userId,
            },
            update: {
                token,
                createdAt: new Date(),
            },
            create: {
                userId,
                token,
            },
        });

        return Boolean(result);
    }

    async deleteRefreshToken(userId: string) {
        const result = await this.prisma.refreshToken.deleteMany({
            where: {
                userId,
            },
        });

        return result.count > 0;
    }

    async validateRefreshToken(userId: string, token: string) {
        const tokenEntry = await this.prisma.refreshToken.findUnique({
            where: {
                userId,
            },
        });

        return tokenEntry?.token === token;
    }
}
