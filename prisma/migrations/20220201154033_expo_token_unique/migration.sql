/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `ExpoPushNotificationAccessToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ExpoPushNotificationAccessToken_token_key` ON `ExpoPushNotificationAccessToken`(`token`);
