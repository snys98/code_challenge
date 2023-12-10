import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';

@Injectable()
export class UserService {
  async getUsers() {
    return await this.userModel.find().exec();
  }

  private readonly logger = new Logger(UserService.name);
  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  async lockUser(userId: string): Promise<void> {
    this.logger.log(`Locking user: ${userId}`);
    const user = await this.userModel.findOne({ _id: userId }).exec();
    user.locked = true;
    await user.save();
    this.logger.log(`User locked for user: ${user.username}`);
  }

  async seedData() {
    const result = await this.userModel.insertMany([
      //md5
      { username: 'admin', password: '21232f297a57a5a743894a0e4a801fc3', locked: false },
      { username: 'user', password: 'ee11cbb19052e40b07aac0ca060c23ee', locked: false },
    ]);
    this.logger.log(`Seeded data: ${result}`);
  }
}  
