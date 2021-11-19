-- AddForeignKey
ALTER TABLE `school` ADD CONSTRAINT `school_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
