/*
 Warnings:
 
 - You are about to drop the column `expiredAt` on the `Tag` table. All the data in the column will be lost.
 
 */
-- AlterTable
ALTER TABLE "Tag"
  RENAME COLUMN "expiredAt" TO "expiresAt";
