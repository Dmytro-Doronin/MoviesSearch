import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeEach(async () => {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User" CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "RefreshToken" CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "WishlistMovie" CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Movie" CASCADE`);
});
