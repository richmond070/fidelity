/*
  Warnings:

  - You are about to drop the column `deopsitId` on the `transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[depositId]` on the table `transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `depositId` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_deopsitId_fkey";

-- DropIndex
DROP INDEX "transaction_deopsitId_key";

-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "deopsitId",
ADD COLUMN     "depositId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transaction_depositId_key" ON "transaction"("depositId");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_depositId_fkey" FOREIGN KEY ("depositId") REFERENCES "Deposit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
