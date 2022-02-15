/*
  Warnings:

  - A unique constraint covering the columns `[friendRequestId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdAt]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `friendRequestId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `userId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `FriendRequest` (
    `id` VARCHAR(191) NOT NULL,
    `fromUserId` VARCHAR(191) NOT NULL,
    `toUserId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `FriendRequest_id_key`(`id`),
    UNIQUE INDEX `FriendRequest_createdAt_key`(`createdAt`),
    PRIMARY KEY (`fromUserId`, `toUserId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Friends` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `otherUserId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Friends_createdAt_key`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Notification_friendRequestId_key` ON `Notification`(`friendRequestId`);

-- CreateIndex
CREATE UNIQUE INDEX `User_createdAt_key` ON `User`(`createdAt`);

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_friendRequestId_fkey` FOREIGN KEY (`friendRequestId`) REFERENCES `FriendRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FriendRequest` ADD CONSTRAINT `FriendRequest_fromUserId_fkey` FOREIGN KEY (`fromUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FriendRequest` ADD CONSTRAINT `FriendRequest_toUserId_fkey` FOREIGN KEY (`toUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_otherUserId_fkey` FOREIGN KEY (`otherUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
