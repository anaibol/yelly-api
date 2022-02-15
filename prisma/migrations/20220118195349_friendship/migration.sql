-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_friendRequestId_fkey`;

-- AlterTable
ALTER TABLE `FriendRequest` ADD COLUMN `notificationId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Notification` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_friendRequestId_fkey` FOREIGN KEY (`friendRequestId`) REFERENCES `FriendRequest`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
