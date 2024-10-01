-- CreateTable
CREATE TABLE "User" (
    "idx" SERIAL NOT NULL,
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "Todo" (
    "idx" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDone" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userIdx" INTEGER NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "Post" (
    "idx" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userIdx" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "Comment" (
    "idx" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postIdx" INTEGER NOT NULL,
    "userIdx" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("idx")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_userIdx_fkey" FOREIGN KEY ("userIdx") REFERENCES "User"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userIdx_fkey" FOREIGN KEY ("userIdx") REFERENCES "User"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postIdx_fkey" FOREIGN KEY ("postIdx") REFERENCES "Post"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userIdx_fkey" FOREIGN KEY ("userIdx") REFERENCES "User"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;
