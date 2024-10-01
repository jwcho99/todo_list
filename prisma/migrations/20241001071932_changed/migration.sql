/*
  Warnings:

  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nickname]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Todo', 'InProgress', 'Done', 'Pending');

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postIdx_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userIdx_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userIdx_fkey";

-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "id";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Task" (
    "idx" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "todoIdx" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("idx")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_todoIdx_fkey" FOREIGN KEY ("todoIdx") REFERENCES "Todo"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;
