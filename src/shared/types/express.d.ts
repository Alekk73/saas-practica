import { UserRole } from 'generated/prisma_client/enums';

declare global {
  namespace Express {
    interface Request {
      user: {
        sub: string;
        name: string;
        email: string;
        tenant_id: string;
        role: UserRole;
      };
    }
  }
}
