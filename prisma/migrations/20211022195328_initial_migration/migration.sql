-- CreateTable
CREATE TABLE `city` (
    `id` BINARY(16) NOT NULL,
    `country_id` BINARY(16) NULL,
    `name` VARCHAR(255) NOT NULL,
    `google_place_id` VARCHAR(255) NULL,
    `lat` VARCHAR(255) NULL,
    `lng` VARCHAR(255) NULL,
    `is_valid` BOOLEAN NULL,

    INDEX `IDX_2D5B0234F92F3E70`(`country_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `country` (
    `id` BINARY(16) NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `doctrine_migration_versions` (
    `version` VARCHAR(191) NOT NULL,
    `executed_at` DATETIME(0) NULL,
    `execution_time` INTEGER NULL,

    PRIMARY KEY (`version`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group` (
    `id` BINARY(16) NOT NULL,
    `owner_id` BINARY(16) NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `IDX_6DC044C57E3C61F9`(`owner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group_members` (
    `id` BINARY(16) NOT NULL,
    `group_info_id` BINARY(16) NOT NULL,
    `user_id` BINARY(16) NOT NULL,
    `role` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `banned` BOOLEAN NULL,

    INDEX `IDX_C3A086F3A76ED395`(`user_id`),
    INDEX `IDX_C3A086F3DB8B95F4`(`group_info_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` BINARY(16) NOT NULL,
    `user_source_id` BINARY(16) NOT NULL,
    `user_target_id` BINARY(16) NULL,
    `action` ENUM('seen', 'add', 'groupMembershipRequest') NULL,
    `is_seen` BOOLEAN NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `item_id` VARCHAR(255) NULL,

    INDEX `IDX_BF5476CA156E8682`(`user_target_id`),
    INDEX `IDX_BF5476CA95DC9185`(`user_source_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school` (
    `id` BINARY(16) NOT NULL,
    `country_id` BINARY(16) NULL,
    `name` VARCHAR(255) NOT NULL,
    `postal_code` VARCHAR(255) NULL,
    `google_place_id` VARCHAR(255) NULL,
    `lat` VARCHAR(255) NULL,
    `lng` VARCHAR(255) NULL,
    `is_valid` BOOLEAN NULL,

    INDEX `IDX_F99EDABBF92F3E70`(`country_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `training` (
    `id` BINARY(16) NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` BINARY(16) NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(180) NOT NULL,
    `roles` LONGTEXT NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `birthdate` DATE NOT NULL,
    `picture_id` VARCHAR(255) NULL,
    `snapchat` VARCHAR(100) NULL,
    `instagram` VARCHAR(100) NULL,
    `reset_token` VARCHAR(255) NULL,
    `is_verified` BOOLEAN NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `is_actived` BOOLEAN NOT NULL,
    `is_filled` BOOLEAN NOT NULL,
    `android_push_notification_token` VARCHAR(255) NULL,
    `sendbird_access_token` VARCHAR(255) NULL,
    `expo_push_notification_token` VARCHAR(255) NULL,
    `ios_push_notification_token` VARCHAR(255) NULL,
    `about` VARCHAR(255) NULL,
    `locale` VARCHAR(255) NULL,

    UNIQUE INDEX `UNIQ_8D93D649E7927C74`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_training` (
    `id` BINARY(16) NOT NULL,
    `user_id` BINARY(16) NULL,
    `training_id` BINARY(16) NOT NULL,
    `school_id` BINARY(16) NOT NULL,
    `city_id` BINARY(16) NOT NULL,
    `date_begin` DATE NOT NULL,
    `date_end` DATE NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `IDX_359F6E8F8BAC62AF`(`city_id`),
    INDEX `IDX_359F6E8FA76ED395`(`user_id`),
    INDEX `IDX_359F6E8FBEFD98D1`(`training_id`),
    INDEX `IDX_359F6E8FC32A47EE`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `waiting_list` (
    `id` BINARY(16) NOT NULL,
    `email` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group_membership_request` (
    `id` BINARY(16) NOT NULL,
    `user_id` BINARY(16) NOT NULL,
    `group_info_id` BINARY(16) NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,

    INDEX `IDX_9D8B2166A76ED395`(`user_id`),
    INDEX `IDX_9D8B2166DB8B95F4`(`group_info_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `city` ADD CONSTRAINT `FK_2D5B0234F92F3E70` FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `group` ADD CONSTRAINT `FK_6DC044C57E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `group_members` ADD CONSTRAINT `FK_C3A086F3DB8B95F4` FOREIGN KEY (`group_info_id`) REFERENCES `group`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `group_members` ADD CONSTRAINT `FK_C3A086F3A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `FK_BF5476CA95DC9185` FOREIGN KEY (`user_source_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `FK_BF5476CA156E8682` FOREIGN KEY (`user_target_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `school` ADD CONSTRAINT `FK_F99EDABBF92F3E70` FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_training` ADD CONSTRAINT `FK_359F6E8F8BAC62AF` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_training` ADD CONSTRAINT `FK_359F6E8FC32A47EE` FOREIGN KEY (`school_id`) REFERENCES `school`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_training` ADD CONSTRAINT `FK_359F6E8FBEFD98D1` FOREIGN KEY (`training_id`) REFERENCES `training`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_training` ADD CONSTRAINT `FK_359F6E8FA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `group_membership_request` ADD CONSTRAINT `FK_9D8B2166DB8B95F4` FOREIGN KEY (`group_info_id`) REFERENCES `group`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `group_membership_request` ADD CONSTRAINT `FK_9D8B2166A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
