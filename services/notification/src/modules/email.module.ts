import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EmailController } from '@/controllers/email.controller';
import { EmailService } from '@/services/email.service';
import { Transporter, createTransport } from 'nodemailer';

// NOSONAR
type EnvConfig = {
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_SECURE: string;
  SMTP_USERNAME: string;
  SMTP_PASSWORD: string;
  EMAIL_FROM: string;
};

@Module({
  controllers: [EmailController],
  providers: [
    EmailService,
    {
      provide: 'EMAIL_TRANSPORTER',
      useFactory: (configService: ConfigService<EnvConfig>): Transporter => {
        return createTransport({
          host: configService.get('SMTP_HOST') as string,
          port: configService.get('SMTP_PORT') as number,
          secure: configService.get('SMTP_SECURE', 'false') === 'true',
          auth: {
            user: configService.get('SMTP_USERNAME') as string,
            pass: configService.get('SMTP_PASSWORD') as string,
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'EMAIL_FROM',
      useFactory: (configService: ConfigService<EnvConfig>) => configService.get('EMAIL_FROM') as string,
      inject: [ConfigService],
    },
  ],
})
export class EmailModule {}
