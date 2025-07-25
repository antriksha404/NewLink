import { Inject, Injectable } from '@nestjs/common';

import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(
    @Inject('EMAIL_TRANSPORTER') private readonly transporter: Transporter,
    @Inject('EMAIL_FROM') private readonly email: string,
  ) /* NOSONAR */ {}

  async sendMail(to: string, subject: string, text: string, html?: string): Promise<void> {
    const mailOptions = {
      from: this.email,
      to,
      subject,
      text,
      html,
    };
    console.log(mailOptions);
    await this.transporter.sendMail(mailOptions);
  }
}
