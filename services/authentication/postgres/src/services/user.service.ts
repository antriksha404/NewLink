import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../schemas/user.schema';
import { UpdateUserDTO } from '../types/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  private excludePassword(user: User | null) {
    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findUser(id: string) {
    return this.userRepository.findById(id);
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.excludePassword(user);
  }

  async findUserByHandler(handler: string) {
    return this.userRepo.findOne({
      where: [{ email: handler }, { phone: handler }],
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

  async updateUser(id: string, updateUserDto: UpdateUserDTO) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.userRepository.findByIdAndUpdate(
      id,
      updateUserDto,
    );
    return this.excludePassword(updatedUser);
  }

  async updateUserByToken(token: string, updateUserDto: UpdateUserDTO) {
    const user = await this.findUserByToken(token);
    const updatedUser = await this.userRepository.findByIdAndUpdate(
      user.id,
      updateUserDto,
    );
    return updatedUser;
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const deletedUser = await this.userRepository.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
    return this.excludePassword(deletedUser);
  }

  async deleteUserByToken(token: string) {
    const user = await this.findUserByToken(token);
    const deletedUser = await this.userRepository.findByIdAndUpdate(user.id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
    return deletedUser;
  }
}
