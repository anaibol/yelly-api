/*
  Warnings:

  - You are about to drop the column `followshipId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `Followship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Followship` DROP FOREIGN KEY `Followship_followeeId_fkey`;

-- DropForeignKey
ALTER TABLE `Followship` DROP FOREIGN KEY `Followship_followerId_fkey`;

-- DropIndex
DROP INDEX `Notification_followshipId_key` ON `Notification`;

-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `followshipId`;

-- DropTable
DROP TABLE `Followship`;
