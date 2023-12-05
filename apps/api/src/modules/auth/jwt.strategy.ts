import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "local") {
    private readonly logger = new Logger(JwtStrategy.name);
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secretKey', // replace with your own secret key  ,
        });
    }

    async validate(payload: any) {
        this.logger.log("validating payload.", payload);
        // you can add more validation logic here  
        return { userId: payload.sub, username: payload.username };
    }
}  
