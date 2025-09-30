import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from '@/controllers/app.controller';
import { EmailModule } from '@/modules/email.module';
import { PlivoModule } from '@/modules/plivo.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), EmailModule, PlivoModule],
  controllers: [AppController],
})
export class AppModule {}
