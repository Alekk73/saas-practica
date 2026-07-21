/*
  Warnings:

  - The values [rejected] on the enum `invitation_status ` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "invitation_status _new" AS ENUM ('accepted', 'expired', 'pending');
ALTER TABLE "public"."tenant_invitations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "tenant_invitations" ALTER COLUMN "status" TYPE "invitation_status _new" USING ("status"::text::"invitation_status _new");
ALTER TYPE "invitation_status " RENAME TO "invitation_status _old";
ALTER TYPE "invitation_status _new" RENAME TO "invitation_status ";
DROP TYPE "public"."invitation_status _old";
ALTER TABLE "tenant_invitations" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;
