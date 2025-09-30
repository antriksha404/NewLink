import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DeleteResult, FilterQuery, Model, UpdateResult } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(filter: FilterQuery<UserDocument>): Promise<User[]> {
    return this.userModel.find(filter).select('-__v').exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-__v').exec();
  }

  async findOne(filter: FilterQuery<UserDocument>): Promise<User | null> {
    return this.userModel.findOne(filter).select('-__v').exec();
  }

  async findByIdAndUpdate(
    id: string,
    data: Partial<User>,
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async create(data: Partial<User>): Promise<User> {
    return this.userModel.create(data);
  }
  async updateOne(
    filter: FilterQuery<UserDocument>,
    data: Partial<User>,
  ): Promise<UpdateResult> {
    return this.userModel
      .updateOne(filter, {
        $set: data,
      })
      .exec();
  }

  async updateMany(
    filter: FilterQuery<UserDocument>,
    data: Partial<User>,
  ): Promise<UpdateResult> {
    return this.userModel
      .updateMany(filter, {
        $set: data,
      })
      .exec();
  }

  async deleteOne(filter: FilterQuery<UserDocument>): Promise<DeleteResult> {
    return this.userModel.deleteOne(filter).exec();
  }
}
