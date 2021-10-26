-- CreateTable
CREATE TABLE `tag` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(30) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `owner_id` BINARY(16) NOT NULL,

    UNIQUE INDEX `tag_text_key`(`text`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `owner_id` BINARY(16) NOT NULL,

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
ALTER TABLE `tag` ADD CONSTRAINT `tag_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostToTag` ADD FOREIGN KEY (`A`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostToTag` ADD FOREIGN KEY (`B`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
