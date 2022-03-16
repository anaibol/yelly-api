/*
  Warnings:

  - The primary key for the `FriendRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
ALTER TABLE `FriendRequest` DROP CONSTRAINT `FriendRequest_fromUserId_fkey`;

ALTER TABLE `FriendRequest` DROP CONSTRAINT `FriendRequest_toUserId_fkey`;

-- AlterTable
ALTER TABLE `FriendRequest` DROP PRIMARY KEY;

ALTER TABLE `FriendRequest` ADD PRIMARY KEY (`id`);

ALTER TABLE `FriendRequest` ADD CONSTRAINT `FriendRequest_fromUserId_fkey` FOREIGN KEY (`fromUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `FriendRequest` ADD CONSTRAINT `FriendRequest_toUserId_fkey` FOREIGN KEY (`toUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
