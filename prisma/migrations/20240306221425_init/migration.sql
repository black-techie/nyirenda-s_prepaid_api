-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "paymentGatewayId" INTEGER;

-- CreateTable
CREATE TABLE "paymentGateway" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "headers" VARCHAR(255) NOT NULL,
    "method" VARCHAR(255) NOT NULL,

    CONSTRAINT "paymentGateway_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_paymentGatewayId_fkey" FOREIGN KEY ("paymentGatewayId") REFERENCES "paymentGateway"("id") ON DELETE SET NULL ON UPDATE CASCADE;
