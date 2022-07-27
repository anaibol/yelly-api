-- AlterEnum
ALTER TYPE "ActivityType" ADD VALUE 'CREATED_POST_USER_MENTION';

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'USER_MENTIONED_YOU';

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "postUserMentionId" BIGINT;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "postUserMentionId" BIGINT;

-- CreateTable
CREATE TABLE "PostUserMention" (
    "id" BIGINT NOT NULL DEFAULT generate_id(),
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" BIGINT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "activityId" BIGINT NOT NULL,

    CONSTRAINT "PostUserMention_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostUserMention_createdAt_key" ON "PostUserMention"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PostUserMention_notificationId_key" ON "PostUserMention"("notificationId");

-- CreateIndex
CREATE UNIQUE INDEX "PostUserMention_activityId_key" ON "PostUserMention"("activityId");

-- CreateIndex
CREATE INDEX "PostUserMention_postId_idx" ON "PostUserMention"("postId");

-- AddForeignKey
ALTER TABLE "PostUserMention" ADD CONSTRAINT "PostUserMention_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostUserMention" ADD CONSTRAINT "PostUserMention_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostUserMention" ADD CONSTRAINT "PostUserMention_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostUserMention" ADD CONSTRAINT "PostUserMention_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
