-- DropForeignKey
ALTER TABLE `PostPollOption` DROP FOREIGN KEY `PostPollOption_postId_fkey`;

-- DropForeignKey
ALTER TABLE `PostPollVote` DROP FOREIGN KEY `PostPollVote_postId_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `isBanned` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `PostPollOption` ADD CONSTRAINT `PostPollOption_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostPollVote` ADD CONSTRAINT `PostPollVote_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
