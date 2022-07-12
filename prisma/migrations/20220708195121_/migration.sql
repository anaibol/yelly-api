/*
  Warnings:

  - You are about to drop the column `postCount` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "postCount",
ADD COLUMN     "newPostCount" INTEGER;
