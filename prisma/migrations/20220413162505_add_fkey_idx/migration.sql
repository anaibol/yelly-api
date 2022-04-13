-- DropIndex
DROP INDEX "Post_authorId_id_key";

-- DropIndex
DROP INDEX "Post_createdAt";

-- DropIndex
DROP INDEX "Tag_text_idx";

-- CreateIndex
CREATE INDEX "City_countryId_idx" ON "City"("countryId");

-- CreateIndex
CREATE INDEX "ExpoPushNotificationAccessToken_userId_idx" ON "ExpoPushNotificationAccessToken"("userId");

-- CreateIndex
CREATE INDEX "Friend_userId_idx" ON "Friend"("userId");

-- CreateIndex
CREATE INDEX "FriendRequest_fromUserId_toUserId_idx" ON "FriendRequest"("fromUserId", "toUserId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- CreateIndex
CREATE INDEX "PostPollOption_postId_idx" ON "PostPollOption"("postId");

-- CreateIndex
CREATE INDEX "PostPollVote_optionId_idx" ON "PostPollVote"("optionId");

-- CreateIndex
CREATE INDEX "PostPollVote_postId_idx" ON "PostPollVote"("postId");

-- CreateIndex
CREATE INDEX "Tag_isLive_countryId_idx" ON "Tag"("isLive", "countryId");

-- RenameIndex
ALTER INDEX "Post_expiresAt" RENAME TO "Post_expiresAt_idx";

-- RenameIndex
ALTER INDEX "Tag_createdAt" RENAME TO "Tag_createdAt_idx";
