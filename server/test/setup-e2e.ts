import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '../.env.test'),
    override: true,
});

console.log('E2E DATABASE_URL =', process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set from .env.test');
}

const prisma = new PrismaClient();

beforeEach(async () => {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User" CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "RefreshToken" CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "WishlistMovie" CASCADE`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Movie" CASCADE`);
});

afterAll(async () => {
    await prisma.$disconnect();
});
