-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_user_id_fkey";

-- DropIndex
DROP INDEX "files_user_id_key";

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "secretusers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
