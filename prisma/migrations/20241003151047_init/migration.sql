-- CreateEnum
CREATE TYPE "Status" AS ENUM ('BOUNCED', 'DELIVERED', 'OPENED', 'CLICKED', 'FULL', 'COMPLAINT');

-- CreateTable
CREATE TABLE "Email" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);
