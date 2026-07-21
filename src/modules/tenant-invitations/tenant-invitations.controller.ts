import { Controller, Get, Post, Body, Param, Req, Query } from '@nestjs/common';
import { TenantInvitationsService } from './tenant-invitations.service';
import { CreateTenantInvitationDto } from './dto/create-tenant-invitation.dto';
import { Request } from 'express';

@Controller('tenant-invitations')
export class TenantInvitationsController {
  constructor(
    private readonly tenantInvitationsService: TenantInvitationsService,
  ) {}

  @Post()
  create(
    @Body() createTenantInvitationDto: CreateTenantInvitationDto,
    @Req() req: Request,
  ) {
    const userActive = req.user;

    return this.tenantInvitationsService.create(
      userActive,
      createTenantInvitationDto,
    );
  }

  @Get()
  findAllByTenant(@Req() req: Request) {
    const userActive = req.user;
    return this.tenantInvitationsService.findAllByTenant(userActive.tenant_id);
  }

  @Get('verify')
  verifyInvitation(@Query('token') token: string) {
    return this.tenantInvitationsService.verifyInvitation(token);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantInvitationsService.findOne(id);
  }
}
