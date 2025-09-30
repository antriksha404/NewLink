import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationController } from 'src/controllers/authentication.controller';
import { UserRepository } from 'src/repositories/user.repository';
import { User } from 'src/schemas/user.schema';
import { AuthenticationService } from 'src/services/authentication.service';
import { UserService } from 'src/services/user.service';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
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
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRATION'),
            algorithm: 'RS256',
          },
        };
      },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, UserService, UserRepository],
})
export class AuthenticationModule {}
