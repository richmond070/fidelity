/*
  Warnings:

  - Added the required column `isVerified` to the `Deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plan` to the `Deposit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deposit" ADD COLUMN     "isVerified" BOOLEAN NOT NULL,
ADD COLUMN     "plan" TEXT NOT NULL;
