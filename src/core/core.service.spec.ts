import { CoreService } from '@/core/core.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { MessagePatterns } from '@/constants/MessagePatterns';

describe('core service test', function () {
  let service: CoreService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<CoreService>(CoreService);
  });

  it('emit hello', async function () {
    const res = await service.microserviceClient.emit(MessagePatterns.test, '');
    expect(res).toBeDefined();
  });
});
