import { Cache } from 'cache-manager';
import { Model } from 'mongoose';

import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @Inject(Cache) private readonly cache: Cache,
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
        await this.cache.set(`session:${user.id}`, tokenModel, 60 * 60 * 24 * 7);
        return tokenModel;
    }
}  
