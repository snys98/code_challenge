import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "local") {
    private readonly logger = new Logger(JwtStrategy.name);
    constructor(@InjectRedis() private readonly redis: Redis,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secretKey', // replace with your own secret key  ,
        });
    }

    async validate(payload: any) {
        const token = await this.redis.get(`session:${payload.sub}`);
        if (!token) {
            throw new UnauthorizedException();
        }
        // you can add more validation logic here  
        return payload;
    }
}  
