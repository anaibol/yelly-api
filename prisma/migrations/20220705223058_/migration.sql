/*
  Warnings:

  - The values [POST_REACTION_CREATED,TAG_REACTION_CREATED,NEW_FOLLOWER,NEW_POSTS_ON_YOUR_TAG] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `FeedItem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tagId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CREATED_TAG_REACTION', 'CREATED_TAG', 'CREATED_POST');

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('REPLIED_TO_YOUR_POST', 'REPLIED_TO_SAME_POST_AS_YOU', 'REACTED_TO_YOUR_POST', 'REACTED_TO_YOUR_TAG', 'IS_NOW_FOLLOWING_YOU', 'YOUR_TAG_IS_TRENDING', 'THERE_ARE_NEW_POSTS_ON_YOUR_TAG');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "FeedItem" DROP CONSTRAINT "FeedItem_postId_fkey";

-- DropForeignKey
ALTER TABLE "FeedItem" DROP CONSTRAINT "FeedItem_tagId_fkey";

-- DropForeignKey
ALTER TABLE "FeedItem" DROP CONSTRAINT "FeedItem_userId_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "postCount" INTEGER,
ADD COLUMN     "postId" BIGINT,
ADD COLUMN     "tagId" BIGINT;

-- DropTable
DROP TABLE "FeedItem";

-- DropEnum
DROP TYPE "FeedItemType";

-- CreateTable
CREATE TABLE "Activity" (
    "id" BIGINT NOT NULL DEFAULT generate_id(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" BIGINT,
    "tagId" BIGINT,
    "type" "ActivityType" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Activity_createdAt" ON "Activity"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_tagId_key" ON "Notification"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_postId_key" ON "Notification"("postId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
