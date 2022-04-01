import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { UdpServerModule } from 'api/udp-server/udp-server.module';
import { UdpServerService } from './udp-server.service';

describe('UdpServerService', () => {
  let service: UdpServerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UdpServerModule],
    }).compile();

    service = module.get<UdpServerService>(UdpServerService);
  });

  it('udp test', (done) => {
    service.on((message) => {
      expect(message).toBe('尼嚎');
      done();
    });
    service.send('尼嚎');
  });
});
