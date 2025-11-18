/*
  Warnings:

  - Added the required column `price` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `Movement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Movement" DROP CONSTRAINT "Movement_productId_fkey";

-- AlterTable
ALTER TABLE "Movement" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL,
ALTER COLUMN "productId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
