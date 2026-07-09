import { UserRole } from 'generated/prisma_client/enums';

export class CreateUserDto {
  tenant_id: string;
  name: string;
  lastname: string;
  email: string;
  password_hash: string;
  role: UserRole;
}
