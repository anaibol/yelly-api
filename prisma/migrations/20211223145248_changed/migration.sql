-- AlterTable
ALTER TABLE `Post` ADD COLUMN `schoolId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `School`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
