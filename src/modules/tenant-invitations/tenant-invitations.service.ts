import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTenantInvitationDto } from './dto/create-tenant-invitation.dto';
import { MailProvider } from '../mail/mail.provider';
import {
  JwtPayload,
  JwtPayloadInviteToTenant,
} from 'src/shared/interfaces/jwt-payload.interface';
import { TenantsService } from '../tenants/tenants.service';
import { PrismaService } from 'prisma/prisma.service';
import { InvitationStatus } from 'generated/prisma_client/enums';
import { TenantInvitations } from 'generated/prisma_client/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TenantInvitationsService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,

    private readonly mailService: MailProvider,
    private readonly tenantService: TenantsService,
  ) {}

  async create(
    senderData: JwtPayload,
    createTenantInvitationDto: CreateTenantInvitationDto,
  ) {
    const tenant = await this.tenantService.findOne(senderData.tenant_id);
    const findInvitationGuest = await this.prisma.tenantInvitations.findFirst({
      where: {
        tenant_id: tenant.id,
        email: createTenantInvitationDto.email,
        status: InvitationStatus.PENDING,
      },
    });

    if (findInvitationGuest)
      throw new BadRequestException('Existing pending invitation');

    const invitation = await this.prisma.tenantInvitations.create({
      data: {
        sender_id: senderData.sub,
        email: createTenantInvitationDto.email,
        tenant_id: tenant.id,
        role: createTenantInvitationDto.role,
        status: InvitationStatus.PENDING,
      },
    });

    const payload: JwtPayloadInviteToTenant = {
      invitation_id: invitation.id,
      emailGuest: createTenantInvitationDto.email,
      tenant_id: tenant.id,
      role: createTenantInvitationDto.role,
      invitedBy: senderData.name,
    };

    const tokenInvitation = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    const data = {
      email: createTenantInvitationDto.email,
      name: createTenantInvitationDto.name,
      role: createTenantInvitationDto.role,
      companyName: tenant.name,
      token: tokenInvitation,
    };

    await this.mailService.sendMail(
      data,
      `User Registration Login to ${tenant.name}`,
    );

    return invitation;
  }

  async findAllByTenant(tenantId: string): Promise<TenantInvitations[]> {
    return await this.prisma.tenantInvitations.findMany({
      where: { tenant_id: tenantId },
    });
  }

  async findOne(id: string): Promise<TenantInvitations> {
    const invitation = await this.prisma.tenantInvitations.findUnique({
      where: { id },
    });
    if (!invitation) throw new NotFoundException('Invitation not found');

    return invitation;
  }

  async verifyInvitation(invitationId: string): Promise<boolean> {
    const existInvitation = await this.prisma.tenantInvitations.findFirst({
      where: { id: invitationId },
    });
    if (!existInvitation) throw new NotFoundException('Invitation not found');

    return true;
  }

  async update(id: string, data: Partial<TenantInvitations>) {
    return await this.prisma.tenantInvitations.update({
      where: {
        id,
      },
      data,
    });
  }
}
