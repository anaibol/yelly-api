/*
  Warnings:

  - You are about to alter the column `lat` on the `city` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Double`.
  - You are about to alter the column `lng` on the `city` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Double`.
  - You are about to alter the column `lat` on the `school` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Double`.
  - You are about to alter the column `lng` on the `school` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Double`.

*/
-- AlterTable
ALTER TABLE `city` MODIFY `lat` DOUBLE NULL,
    MODIFY `lng` DOUBLE NULL;

-- AlterTable
ALTER TABLE `school` MODIFY `lat` DOUBLE NULL,
    MODIFY `lng` DOUBLE NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `date_begin` DATE NULL,
    ADD COLUMN `date_end` DATE NULL,
    ADD COLUMN `school_id` BINARY(16) NULL,
    ADD COLUMN `training_id` BINARY(16) NULL;

-- CreateIndex
CREATE INDEX `IDX_359F6E8FBEFD98D1` ON `user`(`training_id`);

-- CreateIndex
CREATE INDEX `IDX_359F6E8FC32A47EE` ON `user`(`school_id`);

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `school`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_training_id_fkey` FOREIGN KEY (`training_id`) REFERENCES `training`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
