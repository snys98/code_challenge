import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "local") {
    private readonly logger = new Logger(JwtStrategy.name);
    constructor(private readonly authService: AuthService,
        @InjectRedis() private readonly redis: Redis,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secretKey', // replace with your own secret key  ,
        });
    }

    async validate(payload: any) {
        this.logger.log("validating payload.", payload);
        const token = await this.redis.get(`session:${payload.sub}`);
        // you can add more validation logic here  
        return { userId: payload.sub, username: payload.username };
    }
}  
