/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `expiresIn` on the `Post` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Post_expiresAt_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "expiresAt",
DROP COLUMN "expiresIn";
