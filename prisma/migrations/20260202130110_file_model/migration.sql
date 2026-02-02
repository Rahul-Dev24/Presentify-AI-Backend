-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('YOUTUBE', 'VIDEO', 'AUDIO', 'SCREEN_RECORD');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "videoId" TEXT,
    "audioId" TEXT,
    "videoUrl" TEXT,
    "audioUrl" TEXT,
    "type" "FileType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
