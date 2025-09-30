import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repositories/user.repository';
import { UpdateUserDTO } from '../types/user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async findUser(id: string) {
    return this.userRepository.findById(id);
  }

  async findUserByHandler(handler: string) {
    return this.userRepository.findOne({
      $or: [{ email: handler }, { phone: handler }],
    });
  }

  async findUserByToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userRepository.findById(decoded.sub as string);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async updateUserByToken(token: string, updateUserDto: UpdateUserDTO) {
    const user = await this.findUserByToken(token);
    const updatedUser = await this.userRepository.findByIdAndUpdate(
      user._id as string,
      updateUserDto,
    );
    return updatedUser;
  }

  async deleteUserByToken(token: string) {
    const user = await this.findUserByToken(token);
    const deletedUser = await this.userRepository.findByIdAndUpdate(
      user._id as string,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
    );
    return deletedUser;
  }
}
