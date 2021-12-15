-- CreateTable
CREATE TABLE "Trader" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "rating" INTEGER,
    "description" TEXT,
    "number" TEXT,
    "trade" TEXT,

    CONSTRAINT "Trader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramLog" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,

    CONSTRAINT "TelegramLog_pkey" PRIMARY KEY ("id")
);
