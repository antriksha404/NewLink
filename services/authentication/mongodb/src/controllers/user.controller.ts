import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UpdateUserDTO } from '../types/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getCurrentUser(@Headers('authorization') auth: string) {
    if (!auth) {
      throw new UnauthorizedException('No token provided');
    }
    const token = auth.replace('Bearer ', '');
    return this.userService.findUserByToken(token);
  }

  @Put('me')
  async updateCurrentUser(
    @Headers('authorization') auth: string,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    if (!auth) {
      throw new UnauthorizedException('No token provided');
    }
    const token = auth.replace('Bearer ', '');
    return this.userService.updateUserByToken(token, updateUserDto);
  }

  @Delete('me')
  async deleteCurrentUser(@Headers('authorization') auth: string) {
    if (!auth) {
      throw new UnauthorizedException('No token provided');
    }
    const token = auth.replace('Bearer ', '');
    return this.userService.deleteUserByToken(token);
  }
}
