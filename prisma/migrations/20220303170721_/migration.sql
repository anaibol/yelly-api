-- RedefineIndex
CREATE UNIQUE INDEX `User_phoneNumber_key` ON `User`(`phoneNumber`);
DROP INDEX `User_phoneNumber_fkey` ON `User`;
