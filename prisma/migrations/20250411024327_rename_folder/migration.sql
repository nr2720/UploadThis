/*
  Warnings:

  - You are about to drop the column `file_name` on the `folders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "folders" DROP COLUMN "file_name",
ADD COLUMN     "folder_name" VARCHAR(255);
