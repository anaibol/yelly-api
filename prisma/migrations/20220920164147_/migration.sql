/*
  Warnings:

  - You are about to drop the column `countryId` on the `Tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_countryId_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "countryId",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;
