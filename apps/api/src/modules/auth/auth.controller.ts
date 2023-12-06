import { Controller, Post, Body, UseGuards, Logger, HttpException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body) {
        const user = await this.authService.validateUser(body.username, body.password);
        if (user) {
            return this.authService.login(user);
        };
        throw new HttpException('Invalid credentials', 400);
        
    }
}  
