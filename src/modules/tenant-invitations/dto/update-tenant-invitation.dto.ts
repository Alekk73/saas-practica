import { PartialType } from '@nestjs/mapped-types';
import { CreateTenantInvitationDto } from './create-tenant-invitation.dto';

export class UpdateTenantInvitationDto extends PartialType(
  CreateTenantInvitationDto,
) {}
