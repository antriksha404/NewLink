import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PlivoController } from '../controllers/plivo.controller';
import { PlivoService } from '../services/plivo.service';
import * as plivo from 'plivo';

@Module({
  providers: [
    PlivoService,
    {
      provide: 'PLIVO_CLIENT',
      useFactory: (configService: ConfigService) =>
        new plivo.Client(configService.get<string>('PLIVO_AUTH_ID'), configService.get<string>('PLIVO_AUTH_TOKEN')),
      inject: [ConfigService],
    },
    {
      provide: 'PLIVO_FROM_WHATSAPP_NUMBER',
      useFactory: (configService: ConfigService) => configService.get<string>('PLIVO_FROM_WHATSAPP_NUMBER', '15557355514'),
      inject: [ConfigService],
    },
    {
      provide: 'PLIVO_FROM_NUMBER',
      useFactory: (configService: ConfigService) => configService.get<string>('PLIVO_FROM_NUMBER', '18563569761'),
      inject: [ConfigService],
    },
  ],
  controllers: [PlivoController],
})
export class PlivoModule {}
