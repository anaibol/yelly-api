-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "interactionsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rank" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "score" DOUBLE PRECISION DEFAULT 0;

-- Compute interactionsCount for existing tags from 12-07-2022
UPDATE "Tag" as TU SET "interactionsCount" = (SELECT
	interactionsCount
FROM
	"Tag" AS T1,
	LATERAL (
		SELECT
			COUNT(*)
		FROM
			"_PostToTag" AS PT
		WHERE
			PT. "B" = T1.id) 
		AS P1 (postsCount),
	LATERAL (
		SELECT
			COUNT(*)
		FROM
			"_PostToTag" AS PT,
			"PostReaction" AS PR
		WHERE
			PT. "B" = T1.id AND
			PT. "A" = PR."postId") 
		AS PR (postsReactionsCount),
	LATERAL (
		SELECT
			COUNT(*)
		FROM
			"_PostToTag" AS PT,
			"Post" AS PP,
			"Post" AS PC
		WHERE
			PT. "B" = T1.id AND
			PT. "A" = PP.id AND
			PP.id = PC."parentId") 
		AS PC (postsChildrenCount),
	LATERAL (
		SELECT
			COUNT(*)
		FROM
			"_PostToTag" AS PT,
			"Post" AS PP,
			"Post" AS PC,
			"PostReaction" AS PR

		WHERE
			PT. "B" = T1.id AND
			PT. "A" = PP.id AND
			PC.id = PR."postId" AND
			PP.id = PC."parentId") 
		AS PCR (postsChildrenReactionsCount),
	LATERAL (
		SELECT
			COUNT(*)
		FROM
			"TagReaction" AS TR
		WHERE
			TR. "tagId" = T1.id) 
		AS R1 (reactionsCount), 
	LATERAL (
		SELECT
			P1.postsCount + R1.reactionsCount + PR.postsReactionsCount + PC.postsChildrenCount + postsChildrenReactionsCount) 
		AS I1 (interactionsCount)
WHERE
	T1.id = TU.id)
WHERE TU."createdAt" > '2022-07-11';

-- Compute score for existing tags from 12-07-2022

UPDATE "Tag" as TU SET score = (SELECT
	(cast(("interactionsCount") AS decimal) / viewCountDivider) * "scoreFactor" AS score
FROM
	"Tag" AS T1,
	LATERAL (
		SELECT
			CASE T1. "viewsCount"
			WHEN 0 THEN
				1
			ELSE
				T1. "viewsCount"
			END AS viewCountDivider) 
		AS E1 (viewCountDivider)
WHERE
	T1.id = TU.id)
	
WHERE TU."createdAt" > '2022-07-11';
