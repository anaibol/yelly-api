-- DropForeignKey
ALTER TABLE `PostReaction` DROP FOREIGN KEY `PostReaction_postId_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `post_author_id_fkey`;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostReaction` ADD CONSTRAINT `PostReaction_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
