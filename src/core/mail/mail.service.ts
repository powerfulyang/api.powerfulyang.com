import { Injectable } from '@nestjs/common';
import type { Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';
import { mailConfig } from '@/configuration/mail.config';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport(mailConfig().transport, mailConfig().defaults);
  }

  sendMail(to: string, subject: string, text: string) {
    return this.transporter.sendMail({
      to,
      subject,
      text,
    });
  }
}
