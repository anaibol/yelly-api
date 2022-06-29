/*
  Warnings:

  - The `postId` column on the `FeedItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `parentId` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `threadId` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PostPollOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PostPollOption` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PostPollVote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PostPollVote` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Tag` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Thread` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Thread` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `postId` on the `FeedEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tagId` on the `FeedEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `postId` on the `PostPollOption` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `optionId` on the `PostPollVote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `postId` on the `PostPollVote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `postId` on the `PostReaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tagId` on the `TagReaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tagId` on the `UserFeedCursor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_PostToTag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_PostToTag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "FeedEvent" DROP CONSTRAINT "FeedEvent_postId_fkey";

-- DropForeignKey
ALTER TABLE "FeedEvent" DROP CONSTRAINT "FeedEvent_tagId_fkey";

-- DropForeignKey
ALTER TABLE "FeedItem" DROP CONSTRAINT "FeedItem_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_threadId_fkey";

-- DropForeignKey
ALTER TABLE "PostPollOption" DROP CONSTRAINT "PostPollOption_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostPollVote" DROP CONSTRAINT "PostPollVote_optionId_fkey";

-- DropForeignKey
ALTER TABLE "PostPollVote" DROP CONSTRAINT "PostPollVote_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostReaction" DROP CONSTRAINT "PostReaction_postId_fkey";

-- DropForeignKey
ALTER TABLE "TagReaction" DROP CONSTRAINT "TagReaction_tagId_fkey";

-- DropForeignKey
ALTER TABLE "UserFeedCursor" DROP CONSTRAINT "UserFeedCursor_tagId_fkey";

-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_B_fkey";

-- AlterTable
ALTER TABLE "FeedEvent" DROP COLUMN "postId",
ADD COLUMN     "postId" BIGINT NOT NULL,
DROP COLUMN "tagId",
ADD COLUMN     "tagId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "FeedItem" DROP COLUMN "postId",
ADD COLUMN     "postId" BIGINT;

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGINT NOT NULL DEFAULT generate_id(),
DROP COLUMN "parentId",
ADD COLUMN     "parentId" BIGINT,
DROP COLUMN "threadId",
ADD COLUMN     "threadId" BIGINT,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PostPollOption" DROP CONSTRAINT "PostPollOption_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGINT NOT NULL DEFAULT generate_id(),
DROP COLUMN "postId",
ADD COLUMN     "postId" BIGINT NOT NULL,
ADD CONSTRAINT "PostPollOption_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PostPollVote" DROP CONSTRAINT "PostPollVote_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGINT NOT NULL DEFAULT generate_id(),
DROP COLUMN "optionId",
ADD COLUMN     "optionId" BIGINT NOT NULL,
DROP COLUMN "postId",
ADD COLUMN     "postId" BIGINT NOT NULL,
ADD CONSTRAINT "PostPollVote_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PostReaction" DROP COLUMN "postId",
ADD COLUMN     "postId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGINT NOT NULL DEFAULT generate_id(),
ADD CONSTRAINT "Tag_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TagReaction" DROP COLUMN "tagId",
ADD COLUMN     "tagId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGINT NOT NULL DEFAULT generate_id(),
ADD CONSTRAINT "Thread_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserFeedCursor" DROP COLUMN "tagId",
ADD COLUMN     "tagId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "_PostToTag" DROP COLUMN "A",
ADD COLUMN     "A" BIGINT NOT NULL,
DROP COLUMN "B",
ADD COLUMN     "B" BIGINT NOT NULL;

-- CreateIndex
CREATE INDEX "PostPollOption_postId_idx" ON "PostPollOption"("postId");

-- CreateIndex
CREATE INDEX "PostPollVote_optionId_idx" ON "PostPollVote"("optionId");

-- CreateIndex
CREATE INDEX "PostPollVote_postId_idx" ON "PostPollVote"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "PostPollVote_authorId_postId_key" ON "PostPollVote"("authorId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "PostReaction_authorId_postId_key" ON "PostReaction"("authorId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "TagReaction_authorId_tagId_key" ON "TagReaction"("authorId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFeedCursor_tagId_userId_key" ON "UserFeedCursor"("tagId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_PostToTag_AB_unique" ON "_PostToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToTag_B_index" ON "_PostToTag"("B");

-- AddForeignKey
ALTER TABLE "FeedItem" ADD CONSTRAINT "FeedItem_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostPollOption" ADD CONSTRAINT "PostPollOption_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostPollVote" ADD CONSTRAINT "PostPollVote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostPollVote" ADD CONSTRAINT "PostPollVote_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "PostPollOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagReaction" ADD CONSTRAINT "TagReaction_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedEvent" ADD CONSTRAINT "FeedEvent_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedEvent" ADD CONSTRAINT "FeedEvent_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeedCursor" ADD CONSTRAINT "UserFeedCursor_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
