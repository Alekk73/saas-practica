-- CreateEnum
CREATE TYPE "invitation_status " AS ENUM ('accepted', 'rejected', 'pending');

-- CreateTable
CREATE TABLE "tenant_invitations" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "role" "user_roles" NOT NULL,
    "status" "invitation_status " NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tenant_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tenant_invitations_sender_id_idx" ON "tenant_invitations"("sender_id");

-- CreateIndex
CREATE INDEX "tenant_invitations_email_idx" ON "tenant_invitations"("email");

-- CreateIndex
CREATE INDEX "tenant_invitations_tenant_id_idx" ON "tenant_invitations"("tenant_id");

-- AddForeignKey
ALTER TABLE "tenant_invitations" ADD CONSTRAINT "tenant_invitations_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_invitations" ADD CONSTRAINT "tenant_invitations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
