/*
  Warnings:

  - The primary key for the `Movie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `posterUrl` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the `WishlistMovie` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `overview` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `popularity` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vote_average` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vote_count` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `Movie` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MOVIE', 'TV');

-- DropForeignKey
ALTER TABLE "WishlistMovie" DROP CONSTRAINT "WishlistMovie_movieId_fkey";

-- DropForeignKey
ALTER TABLE "WishlistMovie" DROP CONSTRAINT "WishlistMovie_userId_fkey";

-- AlterTable
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_pkey",
DROP COLUMN "posterUrl",
DROP COLUMN "year",
ADD COLUMN     "backdrop_path" TEXT,
ADD COLUMN     "overview" TEXT NOT NULL,
ADD COLUMN     "popularity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "poster_path" TEXT,
ADD COLUMN     "release_date" TIMESTAMP(3),
ADD COLUMN     "vote_average" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "vote_count" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Movie_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "WishlistMovie";

-- CreateTable
CREATE TABLE "TvShow" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "first_air_date" TIMESTAMP(3),
    "poster_path" TEXT,
    "backdrop_path" TEXT,
    "originalLanguage" TEXT NOT NULL,
    "popularity" DOUBLE PRECISION NOT NULL,
    "vote_average" DOUBLE PRECISION NOT NULL,
    "vote_count" INTEGER NOT NULL,

    CONSTRAINT "TvShow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishlistItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WishlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WishlistItem_userId_order_idx" ON "WishlistItem"("userId", "order");

-- CreateIndex
CREATE INDEX "WishlistItem_tmdbId_mediaType_idx" ON "WishlistItem"("tmdbId", "mediaType");

-- CreateIndex
CREATE UNIQUE INDEX "WishlistItem_userId_tmdbId_mediaType_key" ON "WishlistItem"("userId", "tmdbId", "mediaType");

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
