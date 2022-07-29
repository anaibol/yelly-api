/*
  Warnings:

  - You are about to drop the column `text` on the `PostUserMention` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[postUserMentionId]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postUserMentionId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PostUserMention" DROP CONSTRAINT "PostUserMention_activityId_fkey";

-- DropForeignKey
ALTER TABLE "PostUserMention" DROP CONSTRAINT "PostUserMention_notificationId_fkey";

-- DropIndex
DROP INDEX "PostUserMention_activityId_key";

-- DropIndex
DROP INDEX "PostUserMention_notificationId_key";

-- AlterTable
ALTER TABLE "PostReaction" ADD COLUMN     "notificationId" TEXT;

-- AlterTable
ALTER TABLE "PostUserMention" DROP COLUMN "text",
ALTER COLUMN "notificationId" DROP NOT NULL,
ALTER COLUMN "activityId" DROP NOT NULL,
ALTER COLUMN "activityId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Activity_postUserMentionId_key" ON "Activity"("postUserMentionId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_postUserMentionId_key" ON "Notification"("postUserMentionId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_postUserMentionId_fkey" FOREIGN KEY ("postUserMentionId") REFERENCES "PostUserMention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_postUserMentionId_fkey" FOREIGN KEY ("postUserMentionId") REFERENCES "PostUserMention"("id") ON DELETE CASCADE ON UPDATE CASCADE;
