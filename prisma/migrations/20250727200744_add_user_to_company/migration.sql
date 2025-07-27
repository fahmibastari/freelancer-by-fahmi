/*
  Warnings:

  - Added the required column `userId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN "userId" TEXT;

-- Assign userId sementara (dummy atau user tertentu). Misalnya, isi semuanya dengan user pertama:
UPDATE "Company" SET "userId" = (
  SELECT "id" FROM "User" ORDER BY "createdAt" LIMIT 1
);

-- Lalu bikin kolom jadi NOT NULL
ALTER TABLE "Company" ALTER COLUMN "userId" SET NOT NULL;


-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
