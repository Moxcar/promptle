-- CreateTable
CREATE TABLE "DailyImageGuess" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imageUrl" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DailyImageGuessAttempt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dailyImageGuessAttemptId" INTEGER NOT NULL,
    "guess" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyImageGuessAttempt_dailyImageGuessAttemptId_fkey" FOREIGN KEY ("dailyImageGuessAttemptId") REFERENCES "DailyImageGuess" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
