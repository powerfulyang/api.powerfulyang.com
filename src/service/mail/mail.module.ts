import { Module } from '@nestjs/common';
import { ConfigModule } from '@/common/config/config.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { MailService } from '@/service/mail/mail.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
