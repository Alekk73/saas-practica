import { UserRole } from 'generated/prisma_client/enums';

export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  tenant_id: string;
  role: UserRole;
}

export interface JwtPayloadInviteToTenant {
  invitation_id: string;
  emailGuest: string;
  tenant_id: string;
  role: UserRole;
  invitedBy: string;
}
