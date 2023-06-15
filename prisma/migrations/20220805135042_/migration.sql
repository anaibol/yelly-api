/*
  Warnings:

  - A unique constraint covering the columns `[nanoId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "nanoId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_nanoId_key" ON "Tag"("nanoId");
