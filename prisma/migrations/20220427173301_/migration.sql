/*
  Warnings:

  - Made the column `requesterId` on table `FollowRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FollowRequest" ALTER COLUMN "requesterId" SET NOT NULL;
