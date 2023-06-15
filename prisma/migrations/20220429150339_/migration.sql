/*
  Warnings:

  - The values [FOLLOWEE_POSTED,POST_REPLIED,SAME_POST_REPLIED] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `postId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `postReactionId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `PostReaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `FeedItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FeedItemType" AS ENUM ('FOLLOWEE_POSTED', 'POST_REPLIED', 'SAME_POST_REPLIED');

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('FOLLOW_REQUEST_PENDING', 'FOLLOW_REQUEST_ACCEPTED');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_postId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_postReactionId_fkey";

-- DropForeignKey
ALTER TABLE "PostReaction" DROP CONSTRAINT "PostReaction_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PostReaction" DROP CONSTRAINT "PostReaction_postId_fkey";

-- DropIndex
DROP INDEX "Notification_postReactionId_key";

-- AlterTable
ALTER TABLE "FeedItem" ADD COLUMN     "type" "FeedItemType" NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "postId",
DROP COLUMN "postReactionId";

-- DropTable
DROP TABLE "PostReaction";
