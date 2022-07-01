/*
  Warnings:

  - You are about to drop the column `sendbirdAccessToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserFeedCursor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserFeedCursor" DROP CONSTRAINT "UserFeedCursor_tagId_fkey";

-- DropForeignKey
ALTER TABLE "UserFeedCursor" DROP CONSTRAINT "UserFeedCursor_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "sendbirdAccessToken";

-- DropTable
DROP TABLE "UserFeedCursor";
