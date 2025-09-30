import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';
import {
  GenerateOtpDTO,
  LoginDTO,
  RegisterDTO,
  TokenDTO,
  VerifyOtpDTO,
} from '../types/authentication.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() body: RegisterDTO) {
    return this.authenticationService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDTO) {
    return this.authenticationService.login(body);
  }

  @Post('otp/generate')
  async generateOtp(@Body() body: GenerateOtpDTO) {
    return this.authenticationService.createOtp(body);
  }

  @Post('otp/verify')
  async verifyOtp(@Body() body: VerifyOtpDTO) {
    return this.authenticationService.verifyOtp(body);
  }

  @Post('token')
  async token(@Body() body: TokenDTO) {
    return this.authenticationService.refreshToken(body);
  }
}
