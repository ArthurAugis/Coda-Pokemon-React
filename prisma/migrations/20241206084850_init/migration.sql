-- CreateTable
CREATE TABLE "TeamSlot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slot" INTEGER NOT NULL,
    "pokemon" TEXT,
    "isShiny" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamSlot_slot_key" ON "TeamSlot"("slot");
