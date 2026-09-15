-- CreateTable
CREATE TABLE "UserStatistic" (
    "userId" TEXT NOT NULL,
    "readers" INTEGER NOT NULL DEFAULT 0,
    "like" INTEGER NOT NULL DEFAULT 0,
    "dislike" INTEGER NOT NULL DEFAULT 0,
    "shared" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserStatistic_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "UserStatistic" ADD CONSTRAINT "UserStatistic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
