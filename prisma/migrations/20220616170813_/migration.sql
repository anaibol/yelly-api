/*
  Warnings:

  - A unique constraint covering the columns `[tagId,userId]` on the table `UserFeedCursor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserFeedCursor_tagId_userId_key" ON "UserFeedCursor"("tagId", "userId");
