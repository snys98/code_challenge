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
    @InjectModel('User') private userModel: Model<User>,
    @Inject(Cache) private readonly cache: Cache,
    @Inject(UserService) private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { 

    // this.userModel = .model('User', UserSchema) as Model<User>;
  }

  async validateUser(username: string, password: string): Promise<Partial<User>> {
    this.logger.log(`validating user for username: ${username}`);
    const user = await this.userModel.findOne({ username: username }).exec();
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
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
      await this.cache.set(failedAttemptsKey, failedAttempts, 1000 * 60 * 5); // Set the cache to expire after 5 minutes.  
      this.logger.log(`Failed login attempts set for ${username}: ${failedAttempts}`);
      if (failedAttempts >= MaxFailedLoginAttempts) {
        try {
          await this.userService.lockUser(user.id)
        } catch (error) {
          this.logger.error(`Failed to lock user for ${username}`);
        }
      }
      throw new UnauthorizedException("Invalid credentials");
    }
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
