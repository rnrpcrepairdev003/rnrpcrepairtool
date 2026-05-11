-- CreateTable
CREATE TABLE "TrelloCardOverride" (
    "trelloCardId" TEXT NOT NULL PRIMARY KEY,
    "callFrequency" TEXT NOT NULL DEFAULT 'NONE',
    "serviceComplexity" TEXT NOT NULL DEFAULT 'MODERATE',
    "paymentType" TEXT NOT NULL DEFAULT 'STANDARD',
    "customerBehavior" TEXT NOT NULL DEFAULT 'NORMAL',
    "notes" TEXT,
    "updatedAt" DATETIME NOT NULL
);
