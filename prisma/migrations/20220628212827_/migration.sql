/*
  Warnings:

  - A unique constraint covering the columns `[tagReactionId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[text,date]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId,date]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FeedEvent" ADD COLUMN     "tagReactionId" BIGINT;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "tagReactionId" BIGINT;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "TagReaction" (
    "id" BIGINT NOT NULL DEFAULT generate_id(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "notificationId" TEXT,

    CONSTRAINT "TagReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TagReaction_authorId_tagId_key" ON "TagReaction"("authorId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_tagReactionId_key" ON "Notification"("tagReactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_text_date_key" ON "Tag"("text", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_authorId_date_key" ON "Tag"("authorId", "date");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_tagReactionId_fkey" FOREIGN KEY ("tagReactionId") REFERENCES "TagReaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagReaction" ADD CONSTRAINT "TagReaction_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagReaction" ADD CONSTRAINT "TagReaction_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedEvent" ADD CONSTRAINT "FeedEvent_tagReactionId_fkey" FOREIGN KEY ("tagReactionId") REFERENCES "TagReaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
