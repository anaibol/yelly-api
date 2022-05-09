-- DropForeignKey
ALTER TABLE "FeedItem" DROP CONSTRAINT "FeedItem_userId_fkey";

-- AddForeignKey
ALTER TABLE "FeedItem" ADD CONSTRAINT "FeedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
