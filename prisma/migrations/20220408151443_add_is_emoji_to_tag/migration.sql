/*
  Warnings:

  - You are about to drop the column `emojis` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "emojis";

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "isEmoji" BOOLEAN NOT NULL DEFAULT false;
