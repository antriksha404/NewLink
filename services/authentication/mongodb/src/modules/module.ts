import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from '../controllers/app.controller';
import { UserRepository } from '../repositories/user.repository';
import { User, UserSchema } from '../schemas/user.schema';
import { UserService } from '../services/user.service';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AuthenticationModule } from './authentication.module';
import { UserModule } from './user.module';

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
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('AUTH_DB_NAME'),
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
    UserModule,
  ],
  controllers: [AppController],
  providers: [UserRepository, UserService, JwtStrategy],
})
export class AppModule {}
