/*
  Warnings:

  - A unique constraint covering the columns `[youtubeId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `durationString` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "FileType" ADD VALUE 'LOCAL_VIDEO';

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "audioTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "categories" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "durationString" TEXT NOT NULL,
ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "videoTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "youtubeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "File_youtubeId_key" ON "File"("youtubeId");
