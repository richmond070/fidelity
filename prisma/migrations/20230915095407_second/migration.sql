/*
  Warnings:

  - Added the required column `depositor` to the `Deposit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deposit" ADD COLUMN     "depositor" INTEGER NOT NULL;
