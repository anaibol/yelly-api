/*
  Warnings:

  - You are about to drop the column `action` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `action`,
    ADD COLUMN `type` ENUM('seen', 'add', 'postReaction') NULL,
    MODIFY `isSeen` BOOLEAN NOT NULL DEFAULT false;
