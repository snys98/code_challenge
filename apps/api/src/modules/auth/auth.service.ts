import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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

    async validateUser(username: string, password: string): Promise<Partial<User>> {
        this.logger.log("validating user");
        const user = await this.userModel.findOne({ username }).exec();
        if (user && user.password === password) {
            const { password, ...result } = user.toObject();
            return user;
        }
        throw new UnauthorizedException();
    }

    async signIn(user: Partial<User>) {
        const payload = {
            sub: user.id,
            id: user.id,
            username: user.username,
        };
        const tokenModel = {
            id: user.id,
            access_token: await this.jwtService.signAsync(payload),
        };
        await this.redis.setex(`session:${user.id}`, 60 * 60 * 24 * 7, JSON.stringify(tokenModel));
        return tokenModel;
    }
}  
