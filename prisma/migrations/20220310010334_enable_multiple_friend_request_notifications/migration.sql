/*
  Warnings:

  - You are about to drop the column `notificationId` on the `FriendRequest` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Notification_createdAt_key` ON `Notification`;

-- DropIndex
ALTER TABLE `Notification` DROP CONSTRAINT `Notification_friendRequestId_fkey`;
DROP INDEX `Notification_friendRequestId_key` ON `Notification`;

-- AlterTable
ALTER TABLE `FriendRequest` DROP COLUMN `notificationId`;
