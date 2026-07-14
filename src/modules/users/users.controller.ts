import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAllByTenant(@Req() req: Request) {
    const userActive = req.user;
    return this.usersService.findAllByTenant(userActive.tenant_id);
  }
}
