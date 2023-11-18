/*
  Warnings:

  - You are about to drop the column `paymentPlan` on the `Deposit` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Deposit` table. All the data in the column will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `transactionId` to the `Deposit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_depositId_fkey";

-- AlterTable
ALTER TABLE "Deposit" DROP COLUMN "paymentPlan",
DROP COLUMN "updateAt",
ADD COLUMN     "transactionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Transaction";
