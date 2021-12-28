/*
  Warnings:

  - A unique constraint covering the columns `[postReactionId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Notification_postReactionId_key` ON `Notification`(`postReactionId`);
