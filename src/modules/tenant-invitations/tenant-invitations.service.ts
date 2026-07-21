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

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await this.prisma.$transaction(async (tx) => {
      const findInvitationGuest = await tx.tenantInvitations.findFirst({
        where: {
          tenant_id: tenant.id,
          email: createTenantInvitationDto.email,
          status: {
            in: [InvitationStatus.ACCEPTED, InvitationStatus.PENDING],
          },
        },
      });

      if (findInvitationGuest?.status === InvitationStatus.ACCEPTED) {
        throw new BadRequestException('Invitation already accepted');
      }

      if (
        findInvitationGuest?.status === InvitationStatus.PENDING &&
        findInvitationGuest.expires_at > new Date()
      ) {
        throw new BadRequestException('Existing pending invitation');
      }

      return tx.tenantInvitations.create({
        data: {
          sender_id: senderData.sub,
          email: createTenantInvitationDto.email,
          tenant_id: tenant.id,
          role: createTenantInvitationDto.role,
          status: InvitationStatus.PENDING,
          expires_at: expiresAt,
        },
      });
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

    await this.mailService.sendMail(
      {
        email: createTenantInvitationDto.email,
        name: createTenantInvitationDto.name,
        role: createTenantInvitationDto.role,
        companyName: tenant.name,
        token: tokenInvitation,
      },
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

  async verifyInvitation(token: string): Promise<boolean> {
    const decodeToken =
      await this.jwtService.verifyAsync<JwtPayloadInviteToTenant>(token);

    const existInvitation = await this.prisma.tenantInvitations.findFirst({
      where: {
        id: decodeToken.invitation_id,
        status: InvitationStatus.PENDING,
      },
    });

    if (!existInvitation) throw new NotFoundException('Invitation not found');

    if (new Date() > existInvitation.expires_at) {
      await this.update(existInvitation.id, {
        status: InvitationStatus.EXPIRED,
      });
      throw new BadRequestException('Invitation expired');
    }

    return true;
  }

  // Mejorar metodo, para limitar a futuro que campos se pueden actualizar
  async update(id: string, data: Partial<TenantInvitations>) {
    return await this.prisma.tenantInvitations.update({
      where: {
        id,
      },
      data,
    });
  }
}
