/*
  Warnings:

  - The values [REACTED_TO_YOUR_TAG,YOUR_TAG_IS_TRENDING] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `tagReactionId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `activityId` on the `PostUserMention` table. All the data in the column will be lost.
  - You are about to drop the column `hasBeenTrending` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TagReaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('REPLIED_TO_YOUR_POST', 'REPLIED_TO_SAME_POST_AS_YOU', 'REACTED_TO_YOUR_POST', 'IS_NOW_FOLLOWING_YOU', 'THERE_ARE_NEW_POSTS_ON_YOUR_TAG', 'USER_MENTIONED_YOU');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_postId_fkey";

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_postUserMentionId_fkey";

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_tagReactionId_fkey";

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_tagReactionId_fkey";

-- DropForeignKey
ALTER TABLE "TagReaction" DROP CONSTRAINT "TagReaction_authorId_fkey";

-- DropForeignKey
ALTER TABLE "TagReaction" DROP CONSTRAINT "TagReaction_tagId_fkey";

-- DropIndex
DROP INDEX "Notification_tagReactionId_key";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "tagReactionId";

-- AlterTable
ALTER TABLE "PostUserMention" DROP COLUMN "activityId";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "hasBeenTrending";

-- DropTable
DROP TABLE "Activity";

-- DropTable
DROP TABLE "TagReaction";

-- DropEnum
DROP TYPE "ActivityType";
