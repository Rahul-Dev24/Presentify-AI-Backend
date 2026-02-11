/*
  Warnings:

  - A unique constraint covering the columns `[videoId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[audioId]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_videoId_key" ON "File"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "File_audioId_key" ON "File"("audioId");
