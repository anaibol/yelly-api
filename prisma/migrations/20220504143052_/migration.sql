/*
  Warnings:

  - The primary key for the `FeedItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `FeedItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "City" ALTER COLUMN "id" SET DEFAULT generate_id();

-- AlterTable
ALTER TABLE "Country" ALTER COLUMN "id" SET DEFAULT generate_id();

-- AlterTable
ALTER TABLE "ExpoPushNotificationAccessToken" ALTER COLUMN "id" SET DEFAULT generate_id();

-- AlterTable
ALTER TABLE "FeedItem" DROP CONSTRAINT "FeedItem_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGINT NOT NULL DEFAULT generate_id(),
ADD CONSTRAINT "FeedItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "FollowRequest" ALTER COLUMN "id" SET DEFAULT generate_id();

-- AlterTable
ALTER TABLE "Follower" ALTER COLUMN "id" SET DEFAULT generate_id();

-- AlterTable
ALTER TABLE "Friend" ALTER COLUMN "id" SET DEFAULT generate_id();

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "id" SET DEFAULT generate_id();

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "id" SET DEFAULT generate_id();

-- AlterTable
ALTER TABLE "PostPollOption" ALTER COLUMN "id" SET DEFAULT generate_id();

-- AlterTable
ALTER TABLE "PostPollVote" ALTER COLUMN "id" SET DEFAULT generate_id();

-- AlterTable
ALTER TABLE "School" ALTER COLUMN "id" SET DEFAULT generate_id();

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "id" SET DEFAULT generate_id();

-- AlterTable
ALTER TABLE "Thread" ALTER COLUMN "id" SET DEFAULT generate_id();

-- AlterTable
ALTER TABLE "Training" ALTER COLUMN "id" SET DEFAULT generate_id();

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT generate_id();
