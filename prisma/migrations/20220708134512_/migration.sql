-- CreateIndex
CREATE INDEX "Activity_date_idx" ON "Activity"("date");

-- CreateIndex
CREATE INDEX "Activity_userId_idx" ON "Activity"("userId");

-- CreateIndex
CREATE INDEX "Notification_date_idx" ON "Notification"("date");

-- CreateIndex
CREATE INDEX "Tag_date_idx" ON "Tag"("date");

-- CreateIndex
CREATE INDEX "Tag_authorId_idx" ON "Tag"("authorId");

-- CreateIndex
CREATE INDEX "Tag_isHidden_idx" ON "Tag"("isHidden");
