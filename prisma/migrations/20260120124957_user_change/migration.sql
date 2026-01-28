/*
  Warnings:

  - You are about to drop the `Point` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fName" TEXT NOT NULL,
ADD COLUMN     "lName" TEXT NOT NULL;

-- DropTable
DROP TABLE "Point";
