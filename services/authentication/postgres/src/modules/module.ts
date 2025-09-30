import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '../controllers/app.controller';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../schemas/user.schema';
import { UserService } from '../services/user.service';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AuthenticationModule } from './authentication.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const privateKey = configService.get<string>('JWT_PRIVATE_KEY');
        const publicKey = configService.get<string>('JWT_PUBLIC_KEY');
        if (!privateKey) {
          throw new Error('JWT_PRIVATE_KEY is not configured');
        }
        if (!publicKey) {
          throw new Error('JWT_PUBLIC_KEY is not configured');
        }

        return {
          privateKey,
          publicKey,
          global: true,
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRATION'),
            algorithm: 'RS256',
          },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
        logging: configService.get<boolean>('DB_LOGGING', false),
      }),
    }),
    TypeOrmModule.forFeature([User]),
    CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        return {
          stores: [new KeyvRedis(configService.get('REDIS_URL'))],
        };
      },
    }),
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [UserRepository, UserService, JwtStrategy],
})
export class AppModule {}
