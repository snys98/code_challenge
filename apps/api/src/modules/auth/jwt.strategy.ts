import { Cache } from 'cache-manager';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "local") {
    private readonly logger = new Logger(JwtStrategy.name);
    constructor(@Inject(Cache) private readonly cache: Cache,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secretKey', // replace with your own secret key  ,
        });
    }

    async validate(payload: any) {
        const token = await this.cache.get(`session:${payload.sub}`);
        if (!token) {
            throw new UnauthorizedException();
        }
        // you can add more validation logic here  
        return payload;
    }
}  
