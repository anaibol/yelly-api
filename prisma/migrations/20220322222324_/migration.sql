-- DropForeignKey
ALTER TABLE `PostPollVote` DROP FOREIGN KEY `PostPollVote_optionId_fkey`;

-- AddForeignKey
ALTER TABLE `PostPollVote` ADD CONSTRAINT `PostPollVote_optionId_fkey` FOREIGN KEY (`optionId`) REFERENCES `PostPollOption`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
