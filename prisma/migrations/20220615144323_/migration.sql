/*
  Warnings:

  - The values [TREND_SEEN] on the enum `FeedEventType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `cursor` on the `FeedEvent` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `FeedEvent` table. All the data in the column will be lost.
  - Made the column `postId` on table `FeedEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FeedEventType_new" AS ENUM ('POST_CREATED', 'POST_REACTION_CREATED', 'POST_REPLY_CREATED');
ALTER TABLE "FeedEvent" ALTER COLUMN "type" TYPE "FeedEventType_new" USING ("type"::text::"FeedEventType_new");
ALTER TYPE "FeedEventType" RENAME TO "FeedEventType_old";
ALTER TYPE "FeedEventType_new" RENAME TO "FeedEventType";
DROP TYPE "FeedEventType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "FeedEvent" DROP CONSTRAINT "FeedEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "PostReaction" DROP CONSTRAINT "PostReaction_postId_fkey";

-- DropIndex
DROP INDEX "FeedEvent_postId_idx";

-- DropIndex
DROP INDEX "FeedEvent_postReactionId_idx";

-- DropIndex
DROP INDEX "FeedEvent_tagId_idx";

-- DropIndex
DROP INDEX "FeedEvent_userId_idx";

-- AlterTable
ALTER TABLE "FeedEvent" DROP COLUMN "cursor",
DROP COLUMN "userId",
ADD COLUMN     "postAuthorBirthdate" DATE,
ADD COLUMN     "postAuthorSchoolId" TEXT,
ADD COLUMN     "postReactionAuthorBirthdate" DATE,
ADD COLUMN     "postReactionAuthorSchoolId" TEXT,
ALTER COLUMN "postId" SET NOT NULL;

-- CreateTable
CREATE TABLE "UserFeedCursor" (
    "id" BIGINT NOT NULL DEFAULT generate_id(),
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "cursor" TEXT NOT NULL,

    CONSTRAINT "UserFeedCursor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeedCursor" ADD CONSTRAINT "UserFeedCursor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeedCursor" ADD CONSTRAINT "UserFeedCursor_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
