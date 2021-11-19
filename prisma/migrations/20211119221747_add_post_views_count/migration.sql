/*
  Warnings:

  - You are about to drop the column `viewsCount` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `viewsCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `viewsCount`;
