/*
  Warnings:

  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `postId` VARCHAR(191) NULL,
    ADD COLUMN `type` ENUM('FRIEND_POSTED', 'POST_REPLIED', 'SAME_POST_REPLIED', 'FRIEND_REQUEST', 'FRIEND_REQUEST_ACCEPTED') NOT NULL;
