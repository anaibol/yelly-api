-- DropForeignKey
ALTER TABLE `PostReaction` DROP FOREIGN KEY `PostReaction_postId_fkey`;

-- AlterTable
ALTER TABLE `School` ADD COLUMN `coord` Point NULL;

-- CreateIndex
CREATE INDEX `User_birthdate` ON `User`(`birthdate`);

-- AddForeignKey
ALTER TABLE `PostReaction` ADD CONSTRAINT `PostReaction_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
