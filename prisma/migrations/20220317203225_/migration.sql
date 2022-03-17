/*
  Warnings:

  - You are about to drop the column `authorId` on the `Tag` table. All the data in the column will be lost.
  - Made the column `updatedAt` on table `Tag` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Tag` DROP FOREIGN KEY `Tag_authorId_fkey`;

-- AlterTable
ALTER TABLE `Tag` DROP COLUMN `authorId`,
    MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `User` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
