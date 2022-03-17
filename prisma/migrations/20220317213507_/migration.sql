-- AlterTable
ALTER TABLE `Tag` ADD COLUMN `countryId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Tag` ADD CONSTRAINT `Tag_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
