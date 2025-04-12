-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "file_name" VARCHAR(255),
    "file_size" INTEGER,
    "md5_hash" VARCHAR(255),
    "mime_type" VARCHAR(255),
    "user_id" INTEGER,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "files_user_id_key" ON "files"("user_id");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "secretusers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
