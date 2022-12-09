import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { OfficialAccountService } from './official-account.service';

describe('OfficialAccountService', () => {
  let service: OfficialAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfficialAccountService],
    }).compile();

    service = module.get<OfficialAccountService>(OfficialAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
