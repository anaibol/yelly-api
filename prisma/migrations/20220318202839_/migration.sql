/*
  Warnings:

  - A unique constraint covering the columns `[createdAt]` on the table `PostPoll` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `PostPoll` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
