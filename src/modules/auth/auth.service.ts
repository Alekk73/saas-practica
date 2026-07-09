import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTenantDto } from '../tenants/dto/create-tenant.dto';
import { TenantsService } from '../tenants/tenants.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from 'generated/prisma_client/enums';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,

    private readonly userService: UsersService,
    private readonly tenantService: TenantsService,
  ) {}

  async register(userData: RegisterDto, tenantData: CreateTenantDto) {
    const verifyTenant = await this.tenantService.findByName(tenantData.name);
    if (verifyTenant)
      throw new BadRequestException(
        `Client with name ${tenantData.name} alreary`,
      );

    const result = await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({ data: tenantData });

      const mailUsed = await this.userService.findByEmail(userData.email, tx);
      if (mailUsed)
        throw new BadRequestException('Email address already in use');

      const hashPassword = await bcrypt.hash(
        userData.password,
        Number(process.env.HASH_SALT),
      );

      const { password: _password, ...rest } = userData;
      const newUser: CreateUserDto = {
        ...rest,
        tenant_id: tenant.id,
        password_hash: hashPassword,
        role: UserRole.ADMIN,
      };

      const user = await tx.user.create({ data: newUser });

      return { tenant, user };
    });

    return result;
  }
}
