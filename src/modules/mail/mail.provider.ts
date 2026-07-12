import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { TenantInvitationTemplate } from './templates/mail';
import { UserRole } from 'generated/prisma_client/enums';

interface informationForInvitation {
  email: string;
  name: string;
  role: UserRole;
  companyName: string;
  token: string;
}

@Injectable()
export class MailProvider {
  constructor(private readonly mailService: MailerService) {}

  async sendMail(data: informationForInvitation, subject: string) {
    await this.mailService.sendMail({
      to: data.email,
      subject: subject,
      html: TenantInvitationTemplate(data.token, data.companyName, data.role),
    });
  }
}
