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
import { UserService } from '../user/user.service';

export const MaxFailedLoginAttempts = 3;
@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @Inject(Cache) private readonly cache: Cache,
        @Inject(UserService) private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<Partial<User>> {
        this.logger.log("validating user");
        const user = await this.userModel.findOne({ username }).exec();
        if (user && user.password === password) {
            const { password, ...result } = user.toObject();
            return user;
        }
        if (user) {
            const failedAttemptsKey = `Auth:FailedAttempts:${user.id}`;
            if (user.locked) {
                throw new UnauthorizedException("User account is locked.");
            }  
            if (user.password === password) {
                await this.cache.del(failedAttemptsKey);
                const { password, ...result } = user.toObject();
                return result;
            }
            else {
                // If the password is incorrect, increase the failed login attempts.  
                let failedAttempts = await this.cache.get<number>(failedAttemptsKey) || 0;
                failedAttempts++;
                await this.cache.set(failedAttemptsKey, failedAttempts, 300); // Set the cache to expire after 5 minutes.  
                if (failedAttempts >= MaxFailedLoginAttempts) {
                    await this.userService.lockUser(username);
                }  
            }
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
        await this.cache.set(`Auth:Session:${user.id}`, tokenModel, 60 * 60 * 24 * 7);
        return tokenModel;
    }
}  
