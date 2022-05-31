-- AlterTable
ALTER TABLE "PostEvent" ADD COLUMN     "postReactionId" BIGINT;

-- AddForeignKey
ALTER TABLE "PostEvent" ADD CONSTRAINT "PostEvent_postReactionId_fkey" FOREIGN KEY ("postReactionId") REFERENCES "PostReaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
