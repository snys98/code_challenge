import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.entity';
import Redis from 'ioredis/built/Redis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectRedis() private readonly redis: Redis,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<User> {
        this.logger.log("validating user");
        const user = await this.userModel.findOne({ username }).exec();
        if (user && user.password === password) {
            return user;
        }
        return null;
    }

    async login(user: User) {
        console.log(user);
        const payload = { username: user.username, sub: user.id };
        const tokenModel = {
            userId: user.id,
            access_token: this.jwtService.sign(payload),
        };
        this.logger.log(user);
        await this.redis.setex(`session:${user.id}`, 60 * 60 * 24 * 7, tokenModel.access_token);
        return tokenModel;
    }
}  
