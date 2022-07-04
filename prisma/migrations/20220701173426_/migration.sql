/*
  Warnings:

  - The values [SAME_SCHOOL_POSTED] on the enum `FeedItemType` will be removed. If these variants are still used in the database, this will fail.
  - The values [POST_REACTION] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `FeedEvent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `followerFolloweeId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followerUserId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FeedItemType_new" AS ENUM ('POST_REPLIED', 'SAME_POST_REPLIED', 'FOLLOWEE_CREATED_TAG', 'POSTED_ON_YOUR_TAG', 'FOLLOWEE_POSTED_ON_TAG');
ALTER TABLE "FeedItem" ALTER COLUMN "type" TYPE "FeedItemType_new" USING ("type"::text::"FeedItemType_new");
ALTER TYPE "FeedItemType" RENAME TO "FeedItemType_old";
ALTER TYPE "FeedItemType_new" RENAME TO "FeedItemType";
DROP TYPE "FeedItemType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('POST_REACTION_CREATED', 'TAG_REACTION_CREATED', 'NEW_FOLLOWER');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "FeedEvent" DROP CONSTRAINT "FeedEvent_postId_fkey";

-- DropForeignKey
ALTER TABLE "FeedEvent" DROP CONSTRAINT "FeedEvent_postReactionId_fkey";

-- DropForeignKey
ALTER TABLE "FeedEvent" DROP CONSTRAINT "FeedEvent_tagId_fkey";

-- DropForeignKey
ALTER TABLE "FeedEvent" DROP CONSTRAINT "FeedEvent_tagReactionId_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "followerFolloweeId" TEXT NOT NULL,
ADD COLUMN     "followerUserId" TEXT NOT NULL;

-- DropTable
DROP TABLE "FeedEvent";

-- DropEnum
DROP TYPE "FeedEventType";

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_followerUserId_followerFolloweeId_fkey" FOREIGN KEY ("followerUserId", "followerFolloweeId") REFERENCES "Follower"("userId", "followeeId") ON DELETE RESTRICT ON UPDATE CASCADE;
