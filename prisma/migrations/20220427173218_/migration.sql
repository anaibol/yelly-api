/*
  Warnings:

  - Made the column `toFollowUserId` on table `FollowRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FollowRequest" ALTER COLUMN "toFollowUserId" SET NOT NULL;
