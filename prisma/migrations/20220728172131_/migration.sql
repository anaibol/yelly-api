-- DropForeignKey
ALTER TABLE "PostUserMention" DROP CONSTRAINT "PostUserMention_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostUserMention" DROP CONSTRAINT "PostUserMention_userId_fkey";

-- AddForeignKey
ALTER TABLE "PostUserMention" ADD CONSTRAINT "PostUserMention_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostUserMention" ADD CONSTRAINT "PostUserMention_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
