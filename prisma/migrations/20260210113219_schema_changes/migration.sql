/*
  Warnings:

  - You are about to drop the column `slides` on the `Response` table. All the data in the column will be lost.
  - Added the required column `updateAt` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Response" DROP COLUMN "slides",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Slides" (
    "id" SERIAL NOT NULL,
    "responseId" INTEGER NOT NULL,
    "slideIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "detailedNotes" TEXT NOT NULL,
    "speakerNotes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Slides_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Slides" ADD CONSTRAINT "Slides_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;
