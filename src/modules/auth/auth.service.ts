import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTenantDto } from '../tenants/dto/create-tenant.dto';
import { TenantsService } from '../tenants/tenants.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { InvitationStatus, UserRole } from 'generated/prisma_client/enums';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import {
  JwtPayload,
  JwtPayloadInviteToTenant,
} from 'src/shared/interfaces/jwt-payload.interface';
import { TenantInvitationsService } from '../tenant-invitations/tenant-invitations.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,

    private readonly userService: UsersService,
    private readonly tenantService: TenantsService,
    private readonly tenantInvitationService: TenantInvitationsService,
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

      const user = await this.userService.create(newUser, tx);

      return { tenant, user };
    });

    return result;
  }

  async registerUserForTenant(data: RegisterDto, token: string) {
    const mailInUse = await this.userService.findByEmail(data.email);
    if (mailInUse) throw new BadRequestException('Mail in use');

    const hashPassword = await bcrypt.hash(
      data.password,
      Number(process.env.HASH_SALT),
    );

    const decodeToken =
      await this.jwtService.verifyAsync<JwtPayloadInviteToTenant>(token);

    const tenant = await this.tenantService.findOne(decodeToken.tenant_id);

    const dataUser = {
      name: data.name,
      lastname: data.lastname,
      email: data.email,
      password_hash: hashPassword,
      tenant_id: tenant.id,
      role: decodeToken.role,
    };

    const newUser = await this.userService.create(dataUser);

    await this.tenantInvitationService.update(decodeToken.invitation_id, {
      status: InvitationStatus.ACCEPTED,
    });

    return newUser;
  }

  async login(userData: LoginDto) {
    const user = await this.userService.findByEmail(userData.email);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(userData.password, user.password_hash);
    if (!isMatch) throw new BadRequestException('Credentials invalid');

    const payload: JwtPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      tenant_id: user.tenant_id,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    const { password_hash: _pass, ...restUserData } = user;

    return { accessToken: token, user: restUserData };
  }
}
