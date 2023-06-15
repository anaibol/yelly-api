/*
  Warnings:

  - Made the column `userId` on table `UserFeedCursor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserFeedCursor" ALTER COLUMN "userId" SET NOT NULL;
