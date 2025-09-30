import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(filter: FindOptionsWhere<User>): Promise<User[]> {
    return this.userRepository.find({ where: filter });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOne(filter: FindOptionsWhere<User>): Promise<User | null> {
    return this.userRepository.findOne({ where: filter });
  }

  async findByIdAndUpdate(
    id: string,
    data: Partial<User>,
  ): Promise<User | null> {
    await this.userRepository.update(id, data);
    return this.findById(id);
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async updateOne(
    filter: FindOptionsWhere<User>,
    data: Partial<User>,
  ): Promise<UpdateResult> {
    return this.userRepository.update(filter, data);
  }

  async updateMany(
    filter: FindOptionsWhere<User>,
    data: Partial<User>,
  ): Promise<UpdateResult> {
    return this.userRepository.update(filter, data);
  }

  async deleteOne(filter: FindOptionsWhere<User>): Promise<DeleteResult> {
    return this.userRepository.delete(filter);
  }
}
