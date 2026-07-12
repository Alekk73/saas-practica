import { Reflector } from '@nestjs/core';
import { AuthGuard } from '../guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { TenantsService } from 'src/modules/tenants/tenants.service';
import { UsersService } from 'src/modules/users/users.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    guard = new AuthGuard(
      {} as Reflector,
      {} as UsersService,
      {} as TenantsService,
      {} as JwtService,
    );
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
