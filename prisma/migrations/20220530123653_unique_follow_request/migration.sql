/*
  Warnings:

  - A unique constraint covering the columns `[requesterId,toFollowUserId,status]` on the table `FollowRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FollowRequest_requesterId_toFollowUserId_status_key" ON "FollowRequest"("requesterId", "toFollowUserId", "status");
