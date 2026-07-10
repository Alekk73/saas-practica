import { UserRole } from 'generated/prisma_client/enums';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
      };
    }
  }
}
