/*
  Warnings:

  - You are about to drop the column `firebaseId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Notification_userId_fkey` ON `Notification`;

-- DropIndex
DROP INDEX `User_firebaseId_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `firebaseId`;
