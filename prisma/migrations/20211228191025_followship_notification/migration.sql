/*
  Warnings:

  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userSourceId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userTargetId` on the `Notification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Followship` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[followshipId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Followship` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `userId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_userSourceId_fkey`;

-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_userTargetId_fkey`;

-- AlterTable
ALTER TABLE `Followship` ADD COLUMN `id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `type`,
    DROP COLUMN `userSourceId`,
    DROP COLUMN `userTargetId`,
    ADD COLUMN `followshipId` VARCHAR(191) NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Followship_id_key` ON `Followship`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Notification_followshipId_key` ON `Notification`(`followshipId`);

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_followshipId_fkey` FOREIGN KEY (`followshipId`) REFERENCES `Followship`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
