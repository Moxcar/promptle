-- CreateTable
CREATE TABLE "DailyImageGuess" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyImageGuess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyImageGuessAttempt" (
    "id" SERIAL NOT NULL,
    "dailyImageGuessAttemptId" INTEGER NOT NULL,
    "guess" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyImageGuessAttempt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyImageGuessAttempt" ADD CONSTRAINT "DailyImageGuessAttempt_dailyImageGuessAttemptId_fkey" FOREIGN KEY ("dailyImageGuessAttemptId") REFERENCES "DailyImageGuess"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
