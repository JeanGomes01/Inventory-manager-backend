/*
  Warnings:

  - You are about to drop the column `code` on the `Batch` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Batch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Batch" DROP COLUMN "code",
ADD COLUMN     "quantity" INTEGER NOT NULL;
