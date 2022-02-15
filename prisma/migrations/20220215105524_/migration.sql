-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_followshipId_fkey`;

-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_userId_fkey`;

-- DropIndex
DROP INDEX `Followship_id_key` ON `Followship`;

-- DropIndex
DROP INDEX `Friend_createdAt_key` ON `Friend`;

-- DropIndex
DROP INDEX `FriendRequest_createdAt_key` ON `FriendRequest`;

-- DropIndex
DROP INDEX `User_createdAt_key` ON `User`;

-- RedefineIndex
CREATE UNIQUE INDEX `Post_authorId_id_key` ON `Post`(`authorId`, `id`);
DROP INDEX `author_post_id_fkey` ON `Post`;

-- RedefineIndex
CREATE UNIQUE INDEX `PostReaction_authorId_postId_key` ON `PostReaction`(`authorId`, `postId`);
DROP INDEX `author_post_id_fkey` ON `PostReaction`;
