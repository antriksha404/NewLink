import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { BlockchainModule } from './modules/module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BlockchainModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
