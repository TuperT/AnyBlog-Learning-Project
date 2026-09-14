-- CreateTable
CREATE TABLE "PostStatistic" (
    "postId" TEXT NOT NULL,
    "readers" INTEGER NOT NULL DEFAULT 0,
    "like" INTEGER NOT NULL DEFAULT 0,
    "dislike" INTEGER NOT NULL DEFAULT 0,
    "shared" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PostStatistic_pkey" PRIMARY KEY ("postId")
);

-- AddForeignKey
ALTER TABLE "PostStatistic" ADD CONSTRAINT "PostStatistic_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
