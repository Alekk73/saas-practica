import { Module } from '@nestjs/common';
import { TenantInvitationsService } from './tenant-invitations.service';
import { TenantInvitationsController } from './tenant-invitations.controller';
import { MailModule } from '../mail/mail.module';
import { TenantsModule } from '../tenants/tenants.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [MailModule, TenantsModule, PrismaModule],
  controllers: [TenantInvitationsController],
  providers: [TenantInvitationsService],
  exports: [TenantInvitationsService],
})
export class TenantInvitationsModule {}
