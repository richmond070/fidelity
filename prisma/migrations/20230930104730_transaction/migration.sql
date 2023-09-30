-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('BASIC', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'BASIC';

-- CreateTable
CREATE TABLE "transaction" (
    "id" SERIAL NOT NULL,
    "transactionNumber" TEXT NOT NULL,
    "deopsitId" INTEGER NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaction_deopsitId_key" ON "transaction"("deopsitId");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_deopsitId_fkey" FOREIGN KEY ("deopsitId") REFERENCES "Deposit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
