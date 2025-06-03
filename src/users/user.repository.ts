import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserMapper } from './user.mapper';
import { UserDocument, Users } from './user.schema';
import { User } from './users.entity';

@Injectable()
export class UserRepository {
  constructor(
     @InjectModel(Users.name) private readonly userModel: Model<UserDocument>
  ) {}

  async create(user: User): Promise<User> {
    const persistence = UserMapper.toPersistence(user);
    const created = await this.userModel.create(persistence);
    return UserMapper.toDomain(created);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map(UserMapper.toDomain);
  }

  async deleteById(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }

  async update(id: string, user: User): Promise<User> {
    const persistence = UserMapper.toPersistence(user);
    const updated = await this.userModel.findByIdAndUpdate(
      id,
      persistence,
      { new: true }
    );
    
    return updated ? UserMapper.toDomain(updated) : null;
  }

  async findById(id: string): Promise<User | null> {
      const user = await this.userModel.findById(id).exec();
      return user ? UserMapper.toDomain(user) : null;
  }
}
