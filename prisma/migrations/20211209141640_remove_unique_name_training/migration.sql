-- DropForeignKey
ALTER TABLE `city` DROP FOREIGN KEY `FK_2D5B0234F92F3E70`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `FK_BF5476CA95DC9185`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `FK_BF5476CA156E8682`;

-- AddForeignKey
ALTER TABLE `city` ADD CONSTRAINT `city_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_userSourceId_fkey` FOREIGN KEY (`userSourceId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_userTargetId_fkey` FOREIGN KEY (`userTargetId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
