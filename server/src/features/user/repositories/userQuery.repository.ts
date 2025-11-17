import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/service/prisma.service';

@Injectable()
export class UserQueryRepository {
    constructor(private prisma: PrismaService) {}

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
}
