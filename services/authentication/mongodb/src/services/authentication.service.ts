import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Cache } from 'cache-manager';
import { randomBytes } from 'crypto';
import { UserRepository } from 'src/repositories/user.repository';
import {
  GenerateOtpDTO,
  LoginDTO,
  RegisterDTO,
  TokenDTO,
  VerifyOtpDTO,
} from 'src/types/authentication.dto';
import { UserService } from './user.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}
  private generateReferenceId(): string {
    return randomBytes(4).toString('hex').toUpperCase();
  }
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // NOSONAR
  }

  private generateUniqueUsername(
    firstName?: string,
    lastName?: string,
  ): string {
    const first = (firstName || 'user').toLowerCase();
    const last = (lastName || 'user').toLowerCase();
    return `${first}.${last}.${Date.now()}`;
  }

  private async getOtp(referenceId: string) {
    const otp = await this.cache.get(referenceId);
    return otp ? JSON.parse(otp as string) : null;
  }

  async createOtp(data: GenerateOtpDTO) {
    const referenceId = this.generateReferenceId();
    const otp = this.generateOtp();
    const handler = (data.email || data.phone) as string;
    await this.cache.set(
      referenceId,
      JSON.stringify({
        otp,
        handler,
      }),
      30000000,
    );
    return { referenceId, otp };
  }

  async verifyOtp(data: VerifyOtpDTO) {
    const otp = await this.getOtp(data.referenceId);
    if (!otp) {
      throw new Error('Otp not found');
    }
    if (otp.otp !== data.otp) {
      throw new Error('Invalid otp');
    }

    await this.cache.del(data.referenceId);

    const user = await this.userService.findUserByHandler(
      otp.handler as string,
    );

    if (!user) {
      throw new Error('User not found');
    }

    return this.generateToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });
  }

  generateToken(payload: { id: string; role: string; email: string }) {
    const jwtPayload = {
      sub: payload.id,
      role: payload.role,
      email: payload.email,
    };

    const accessToken = this.jwtService.sign(jwtPayload, {
      privateKey: this.configService.get<string>('JWT_PRIVATE_KEY'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '1d'),
    });

    const refreshToken = this.jwtService.sign(jwtPayload, {
      privateKey: this.configService.get<string>('JWT_PRIVATE_KEY'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
    });

    return {
      userId: payload.id,
      accessToken,
      refreshToken,
    };
  }

  async register(data: RegisterDTO) {
    const existingUser = await this.userService.findUserByHandler(data.email);

    const username = this.generateUniqueUsername(data.firstName, data.lastName);

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = await this.userRepository.create({
      ...data,
      username,
      password: await argon2.hash(data.password),
      role: 'user',
      isActive: true,
    });

    if (user.is2FAEnabled) {
      return this.createOtp({
        email: user.email,
      });
    }

    return this.generateToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });
  }

  async login(data: LoginDTO) {
    const user = await this.userService.findUserByHandler(data.email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.password, data.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    if (user.is2FAEnabled) {
      return this.createOtp({
        email: user.email,
      });
    }
    return this.generateToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });
  }

  async refreshToken(data: TokenDTO) {
    try {
      const payload = await this.jwtService.verifyAsync(data.token, {
        publicKey: this.configService.get<string>('JWT_PUBLIC_KEY'),
        algorithms: ['RS256'],
      });

      const user = await this.userService.findUser(payload.sub as string);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const jwtPayload = {
        sub: user.id,
        role: user.role,
        email: user.email,
      };

      const accessToken = this.jwtService.sign(jwtPayload, {
        privateKey: this.configService.get<string>('JWT_PRIVATE_KEY'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
      });

      const refreshToken = this.jwtService.sign(jwtPayload, {
        privateKey: this.configService.get<string>('JWT_PRIVATE_KEY'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
      });

      return {
        userId: user.id,
        accessToken,
        refreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
