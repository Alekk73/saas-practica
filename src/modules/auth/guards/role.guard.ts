import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole } from 'generated/prisma_client/enums';
import { ROLES_KEY } from 'src/shared/decorators/role.decorators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requireRole = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requireRole) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user;

    if (!user) throw new UnauthorizedException('Unauthenticated user');

    if (!requireRole.includes(user.role))
      throw new ForbiddenException('You do not have sufficient permissions');

    return true;
  }
}
