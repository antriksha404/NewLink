import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from '../controllers/app.controller';
import { BlockchainModule } from './module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BlockchainModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
