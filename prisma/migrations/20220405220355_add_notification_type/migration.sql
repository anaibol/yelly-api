-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('FRIEND_POSTED', 'POST_REPLIED', 'SAME_POST_REPLIED', 'FRIEND_REQUEST', 'FRIEND_REQUEST_ACCEPTED');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "postId" TEXT,
ADD COLUMN     "type" "NotificationType";

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
