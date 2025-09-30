import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserService } from '../services/user.service';
import { UpdateUserDTO } from '../types/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req) {
    return this.userService.findUserById(req.user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateCurrentUser(
    @Request() req,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    return this.userService.updateUser(req.user.id, updateUserDto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  async deleteCurrentUser(@Request() req) {
    return this.userService.deleteUser(req.user.id);
  }
}
