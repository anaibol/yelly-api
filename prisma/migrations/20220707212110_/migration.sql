/*
  Warnings:

  - Made the column `tagId` on table `Activity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `Notification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "tagId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "type" SET NOT NULL;
