/*
  Warnings:

  - A unique constraint covering the columns `[postReactionId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "postReactionId" TEXT;

-- CreateTable
CREATE TABLE "PostReaction" (
    "id" TEXT NOT NULL DEFAULT generate_id(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reaction" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "PostReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostReaction_createdAt_key" ON "PostReaction"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PostReaction_authorId_postId_key" ON "PostReaction"("authorId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_postReactionId_key" ON "Notification"("postReactionId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_postReactionId_fkey" FOREIGN KEY ("postReactionId") REFERENCES "PostReaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE RESTRICT;
