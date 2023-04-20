import { ConfigService } from '@/common/config/config.service';
import { LoggerService } from '@/common/logger/logger.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(MailService.name);
    const { transport, defaults } = this.configService.getMailConfig();
    this.transporter = createTransport(transport, defaults);
  }

  async sendMail(to: string, subject: string, text: string) {
    // TODO persist to db
    const res = await this.transporter.sendMail({
      to,
      subject,
      text,
    });
    if (res.accepted.length === 0) {
      throw new InternalServerErrorException('Mail not accepted!');
    }
    return res;
  }
}
