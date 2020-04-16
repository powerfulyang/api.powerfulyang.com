import { Test, TestingModule } from '@nestjs/testing';
import { StaticService } from './static.service';

describe('StaticService', () => {
  let service: StaticService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaticService],
    }).compile();

    service = module.get<StaticService>(StaticService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
