-- DropIndex
DROP INDEX "Activity_date_idx";

-- DropIndex
DROP INDEX "Activity_userId_idx";

-- CreateIndex
CREATE INDEX "Activity_userId_date_idx" ON "Activity"("userId", "date");
