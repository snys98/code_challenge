import { Controller, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body) {
        if (await this.authService.validateUser(body.username, body.password)) {
            return this.authService.login(body);
        };
        return null;
    }
}  
