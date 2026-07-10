import { UserRole } from 'generated/prisma_client/enums';

export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
}
