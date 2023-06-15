/*
  Warnings:

  - Added the required column `expiredAt` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "expiredAt" TIMESTAMP(3);

-- Migrate existing rows
UPDATE "Tag" SET "expiredAt" = "Tag"."createdAt" + interval '24 hour';
