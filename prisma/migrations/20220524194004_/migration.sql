/*
  Warnings:

  - You are about to drop the column `score` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "score";

-- AlterTable
ALTER TABLE "PostTagRank" ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;
