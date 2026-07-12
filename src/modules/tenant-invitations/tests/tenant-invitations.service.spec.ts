import { Test, TestingModule } from '@nestjs/testing';
import { TenantInvitationsService } from '../tenant-invitations.service';

describe('TenantInvitationsService', () => {
  let service: TenantInvitationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantInvitationsService],
    }).compile();

    service = module.get<TenantInvitationsService>(TenantInvitationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
