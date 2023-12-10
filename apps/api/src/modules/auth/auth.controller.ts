import { Controller, Post, Body, HttpException, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() body) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (user) {
      return this.authService.signIn(user);
    };
    throw new HttpException('Invalid credentials', 400);

  }
}  
