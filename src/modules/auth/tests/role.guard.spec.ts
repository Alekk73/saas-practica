import { Reflector } from '@nestjs/core';
import { RoleGuard } from '../guards/role.guard';

describe('RoleGuard', () => {
  let guard: RoleGuard;

  beforeEach(() => {
    guard = new RoleGuard({} as Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
