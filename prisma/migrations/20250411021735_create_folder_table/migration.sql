-- AlterTable
ALTER TABLE "files" ADD COLUMN     "folder_id" INTEGER;

-- CreateTable
CREATE TABLE "folders" (
    "id" SERIAL NOT NULL,
    "file_name" VARCHAR(255),
    "user_id" INTEGER,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "secretusers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
