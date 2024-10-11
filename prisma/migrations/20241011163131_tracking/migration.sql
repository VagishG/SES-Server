-- CreateTable
CREATE TABLE "Tracking" (
    "id" SERIAL NOT NULL,
    "emailId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "open" BOOLEAN NOT NULL,
    "clicked" BOOLEAN NOT NULL,
    "openedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),

    CONSTRAINT "Tracking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tracking" ADD CONSTRAINT "Tracking_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Email"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
