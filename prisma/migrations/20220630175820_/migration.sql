/*
  Warnings:

  - The values [FOLLOWEE_POSTED] on the enum `FeedItemType` will be removed. If these variants are still used in the database, this will fail.
  - The values [FOLLOW_REQUEST_PENDING,FOLLOW_REQUEST_ACCEPTED] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `followRequestId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `FollowRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FeedItemType_new" AS ENUM ('POST_REPLIED', 'SAME_POST_REPLIED', 'SAME_SCHOOL_POSTED');
ALTER TABLE "FeedItem" ALTER COLUMN "type" TYPE "FeedItemType_new" USING ("type"::text::"FeedItemType_new");
ALTER TYPE "FeedItemType" RENAME TO "FeedItemType_old";
ALTER TYPE "FeedItemType_new" RENAME TO "FeedItemType";
DROP TYPE "FeedItemType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('POST_REACTION');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "FollowRequest" DROP CONSTRAINT "FollowRequest_requesterId_fkey";

-- DropForeignKey
ALTER TABLE "FollowRequest" DROP CONSTRAINT "FollowRequest_toFollowUserId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_followRequestId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "followRequestId";

-- DropTable
DROP TABLE "FollowRequest";

-- DropEnum
DROP TYPE "FollowRequestStatus";
