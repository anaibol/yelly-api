/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_postReactionId_fkey`;
