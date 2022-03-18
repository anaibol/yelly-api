/*
  Warnings:

  - You are about to drop the column `pollId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_schoolId_fkey`;

-- AlterTable
ALTER TABLE `Post` DROP COLUMN `pollId`,
    DROP COLUMN `schoolId`;
