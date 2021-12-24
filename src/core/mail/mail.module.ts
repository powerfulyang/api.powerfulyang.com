import { Module } from '@nestjs/common';
import { MailService } from '@/core/mail/mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
