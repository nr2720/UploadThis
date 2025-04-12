-- CreateTable
CREATE TABLE "days" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "date" DATE,
    "exercise" TEXT,
    "weight" INTEGER,
    "reps" INTEGER,

    CONSTRAINT "days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pr" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "squat" INTEGER,
    "bench" INTEGER,
    "deadlift" INTEGER,

    CONSTRAINT "pr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secretposts" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "text" TEXT,
    "date" DATE,
    "user_id" INTEGER,

    CONSTRAINT "secretposts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secretusers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "lastname" VARCHAR(255),
    "email" VARCHAR(255),
    "password" VARCHAR(255),
    "username" VARCHAR(255),

    CONSTRAINT "secretusers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255),
    "firstname" VARCHAR(255),
    "lastname" VARCHAR(255),
    "age" INTEGER,
    "height" INTEGER,
    "weight" INTEGER,
    "password" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "secretusers_username_key" ON "secretusers"("username");

-- AddForeignKey
ALTER TABLE "days" ADD CONSTRAINT "days_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pr" ADD CONSTRAINT "pr_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "secretposts" ADD CONSTRAINT "secretposts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "secretusers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
