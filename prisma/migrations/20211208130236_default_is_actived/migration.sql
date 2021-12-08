-- AlterTable
ALTER TABLE `user` MODIFY `is_verified` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `is_actived` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `is_filled` BOOLEAN NOT NULL DEFAULT false;
