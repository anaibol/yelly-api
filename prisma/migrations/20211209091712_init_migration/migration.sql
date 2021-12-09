-- CreateTable
CREATE TABLE `city` (
    `id` VARCHAR(36) NOT NULL,
    `countryId` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `googlePlaceId` VARCHAR(255) NULL,
    `lat` DOUBLE NULL,
    `lng` DOUBLE NULL,

    UNIQUE INDEX `city_googlePlaceId_key`(`googlePlaceId`),
    INDEX `IDX_2D5B0234F92F3E70`(`countryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `country` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `country_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` VARCHAR(36) NOT NULL,
    `userSourceId` VARCHAR(36) NOT NULL,
    `userTargetId` VARCHAR(36) NULL,
    `action` ENUM('seen', 'add', 'groupMembershipRequest') NULL,
    `isSeen` BOOLEAN NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `itemId` VARCHAR(255) NULL,

    UNIQUE INDEX `notification_createdAt_key`(`createdAt`),
    INDEX `IDX_BF5476CA156E8682`(`userTargetId`),
    INDEX `IDX_BF5476CA95DC9185`(`userSourceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `googlePlaceId` VARCHAR(255) NULL,
    `lat` DOUBLE NULL,
    `lng` DOUBLE NULL,
    `cityId` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `school_googlePlaceId_key`(`googlePlaceId`),
    INDEX `school_city_id_fkey`(`cityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `training` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `training_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(36) NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `email` VARCHAR(180) NOT NULL,
    `roles` LONGTEXT NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `birthdate` DATE NULL,
    `pictureId` VARCHAR(255) NULL,
    `snapchat` VARCHAR(100) NULL,
    `instagram` VARCHAR(100) NULL,
    `resetToken` VARCHAR(255) NULL,
    `isVerified` BOOLEAN NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL,
    `isActive` BOOLEAN NOT NULL,
    `isFilled` BOOLEAN NOT NULL,
    `androidPushnotificationToken` VARCHAR(255) NULL,
    `sendbirdAccessToken` VARCHAR(255) NULL,
    `expoPushNotificationToken` VARCHAR(255) NULL,
    `iosPushnotificationToken` VARCHAR(255) NULL,
    `about` VARCHAR(255) NULL,
    `locale` VARCHAR(255) NULL,
    `trainingId` VARCHAR(36) NULL,
    `schoolId` VARCHAR(36) NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    INDEX `IDX_359F6E8FBEFD98D1`(`trainingId`),
    INDEX `IDX_359F6E8FC32A47EE`(`schoolId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Followship` (
    `followerId` VARCHAR(36) NOT NULL,
    `followeeId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Followship_createdAt_key`(`createdAt`),
    PRIMARY KEY (`followerId`, `followeeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tag` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(30) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `authorId` VARCHAR(36) NOT NULL,
    `isLive` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `tag_text_key`(`text`),
    INDEX `tag_author_id_fkey`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post` (
    `id` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `authorId` VARCHAR(36) NOT NULL,
    `viewsCount` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `post_createdAt_key`(`createdAt`),
    INDEX `post_author_id_fkey`(`authorId`),
    UNIQUE INDEX `author_post_id_fkey`(`authorId`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_comment` (
    `id` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `authorId` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `post_comment_createdAt_key`(`createdAt`),
    INDEX `post_comment_author_id_fkey`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostReaction` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reaction` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `PostReaction_createdAt_key`(`createdAt`),
    UNIQUE INDEX `author_post_id_fkey`(`authorId`, `postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PostToTag` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PostToTag_AB_unique`(`A`, `B`),
    INDEX `_PostToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `city` ADD CONSTRAINT `FK_2D5B0234F92F3E70` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `FK_BF5476CA95DC9185` FOREIGN KEY (`userSourceId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `FK_BF5476CA156E8682` FOREIGN KEY (`userTargetId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `school` ADD CONSTRAINT `school_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_trainingId_fkey` FOREIGN KEY (`trainingId`) REFERENCES `training`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Followship` ADD CONSTRAINT `Followship_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Followship` ADD CONSTRAINT `Followship_followeeId_fkey` FOREIGN KEY (`followeeId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tag` ADD CONSTRAINT `tag_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_comment` ADD CONSTRAINT `post_comment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostReaction` ADD CONSTRAINT `PostReaction_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostReaction` ADD CONSTRAINT `PostReaction_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostToTag` ADD FOREIGN KEY (`A`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostToTag` ADD FOREIGN KEY (`B`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
