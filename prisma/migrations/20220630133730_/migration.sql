/*
  Warnings:

  - You are about to drop the column `threadId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `isEmoji` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `isLive` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the `Thread` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_threadId_fkey";

-- DropIndex
DROP INDEX "Tag_authorId_date_key";

-- DropIndex
DROP INDEX "Tag_isLive_countryId_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "threadId";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "isEmoji",
DROP COLUMN "isLive";

-- DropTable
DROP TABLE "Thread";
