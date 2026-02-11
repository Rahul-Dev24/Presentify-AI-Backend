/*
  Warnings:

  - You are about to drop the column `audioTags` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `videoTags` on the `File` table. All the data in the column will be lost.
  - The `categories` column on the `File` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `userId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_id_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "audioTags",
DROP COLUMN "videoTags",
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "updateAt" DROP DEFAULT,
DROP COLUMN "categories",
ADD COLUMN     "categories" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updateAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
