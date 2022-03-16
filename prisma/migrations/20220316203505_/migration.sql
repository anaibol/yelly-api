-- DropIndex
DROP INDEX `FriendRequest_id_key` ON `FriendRequest`;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_friendRequestId_fkey` FOREIGN KEY (`friendRequestId`) REFERENCES `FriendRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
