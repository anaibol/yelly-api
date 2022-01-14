-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `postReactionId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_postReactionId_fkey` FOREIGN KEY (`postReactionId`) REFERENCES `PostReaction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
