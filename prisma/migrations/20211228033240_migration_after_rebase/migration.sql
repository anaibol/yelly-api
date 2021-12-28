/*
  Warnings:

  - You are about to drop the column `itemId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `notificationId` on the `PostReaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `itemId`;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_postReactionId_fkey` FOREIGN KEY (`postReactionId`) REFERENCES `PostReaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
