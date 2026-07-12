import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TenantsService } from 'src/modules/tenants/tenants.service';
import { UsersService } from 'src/modules/users/users.service';
import { IS_PUBLIC_KEY } from 'src/shared/decorators/public.decorator';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    private readonly userService: UsersService,
    private readonly tenantService: TenantsService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const cookies = req.headers.cookie;

    const token = extractTokenFromCookie(cookies);

    if (!token) throw new UnauthorizedException('Token not provided');

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Token has expired');
    }

    const existUser = await this.userService.findByEmail(payload.email);
    if (!existUser) throw new NotFoundException('User not found');

    const userData: JwtPayload = {
      sub: existUser.id,
      name: existUser.name,
      email: existUser.email,
      tenant_id: existUser.tenant_id,
      role: existUser.role,
    };

    req.user = userData;
    return true;
  }
}

function extractTokenFromCookie(
  cookieHeader: string | undefined,
): string | null {
  if (!cookieHeader) return null;

  const token = cookieHeader
    .split(';')
    .find((c) => c.trim().startsWith('access_token'))
    ?.split('=')[1];

  return token || null;
}
