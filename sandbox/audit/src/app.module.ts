import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuditModule } from '@newput-newlink/audit';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuditModule.register({
      enable: true
    }),
  ],
  controllers: [AppController],
})
export class AppModule { }
