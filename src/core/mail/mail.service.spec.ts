import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '@/core/mail/mail.service';
import { MailModule } from '@/core/mail/mail.module';
import '@/loadEnv';

describe('test mail module', () => {
  let service: MailService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailModule],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('test send mail', async () => {
    const result = await service.sendMail('i@powerfulyang.com', 'test', 'test');
    expect(result).toBeDefined();
  });
});
