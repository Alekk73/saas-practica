import { Test, TestingModule } from '@nestjs/testing';
import { TenantInvitationsController } from '../tenant-invitations.controller';
import { TenantInvitationsService } from '../tenant-invitations.service';

describe('TenantInvitationsController', () => {
  let controller: TenantInvitationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantInvitationsController],
      providers: [TenantInvitationsService],
    }).compile();

    controller = module.get<TenantInvitationsController>(
      TenantInvitationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
