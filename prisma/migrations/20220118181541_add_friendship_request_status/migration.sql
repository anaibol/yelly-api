/*
  Warnings:

  - You are about to drop the `Friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Friends` DROP FOREIGN KEY `Friends_otherUserId_fkey`;

-- DropForeignKey
ALTER TABLE `Friends` DROP FOREIGN KEY `Friends_userId_fkey`;

-- DropForeignKey
ALTER TABLE `FriendRequest` DROP FOREIGN KEY `FriendRequest_fromUserId_fkey`;

-- DropForeignKey
ALTER TABLE `FriendRequest` DROP FOREIGN KEY `FriendRequest_toUserId_fkey`;

-- AlterTable
ALTER TABLE `FriendRequest` ADD COLUMN `status` ENUM('PENDING', 'ACCEPTED', 'DECLINED') NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE `Friends`;

-- CreateTable
CREATE TABLE `Friend` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `otherUserId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Friend_createdAt_key`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FriendRequest` ADD CONSTRAINT `FriendRequest_fromUserId_fkey` FOREIGN KEY (`fromUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FriendRequest` ADD CONSTRAINT `FriendRequest_toUserId_fkey` FOREIGN KEY (`toUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friend` ADD CONSTRAINT `Friend_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friend` ADD CONSTRAINT `Friend_otherUserId_fkey` FOREIGN KEY (`otherUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
