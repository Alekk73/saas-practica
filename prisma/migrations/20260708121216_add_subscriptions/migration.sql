-- CreateEnum
CREATE TYPE "subscription_types" AS ENUM ('service', 'commerce');

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "type" "subscription_types" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions_tenants" (
    "tenant_id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,

    CONSTRAINT "subscriptions_tenants_pkey" PRIMARY KEY ("tenant_id","subscription_id")
);

-- CreateIndex
CREATE INDEX "subscriptions_tenants_subscription_id_idx" ON "subscriptions_tenants"("subscription_id");

-- AddForeignKey
ALTER TABLE "subscriptions_tenants" ADD CONSTRAINT "subscriptions_tenants_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions_tenants" ADD CONSTRAINT "subscriptions_tenants_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
