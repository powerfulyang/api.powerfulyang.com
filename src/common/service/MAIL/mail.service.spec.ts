import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { MailService } from '@/common/service/MAIL/mail.service';
import { MailModule } from '@/common/service/MAIL/mail.module';
import { SUCCESS } from '@/constants/constants';

describe('test mail module', () => {
  let service: MailService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailModule],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('test send mail', async () => {
    const result = await service.sendMail('i@powerfulyang.com', '这是一封测试邮件', '测试一下!');
    expect(result).toBe(SUCCESS);
  });
});
