import { Controller, Post, Body, BadRequestException, Logger, UseGuards, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
    private readonly logger = new Logger(UserController.name);
    constructor(private readonly userService: UserService,
    ) { }

    @Post("seedData")
    seedData() {
        this.logger.log("Seeding data");
        return this.userService.seedData();
    }

    @UseGuards(AuthGuard('local'))
    @Get()
    async getUsers() {
        const users = await this.userService.getUsers();
        return users.map(user => user.toObject());
    }
}  
