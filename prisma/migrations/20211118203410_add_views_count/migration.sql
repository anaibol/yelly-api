/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `user_training` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `viewsCount` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `user_training_user_id_key` ON `user_training`(`user_id`);
