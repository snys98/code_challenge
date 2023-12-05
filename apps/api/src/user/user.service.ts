import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userModel.findOne({ username }).exec();
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async lockUser(username: string): Promise<any> {
        const user = await this.userModel.findOne({ username }).exec();
        if (user) {
            user.locked = true;
            await user.save();
        }
    }
}  
