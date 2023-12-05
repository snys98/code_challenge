import { Controller, Post, Body, BadRequestException, Logger, UseGuards } from '@nestjs/common';
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
    
    @UseGuards(AuthGuard('jwt'))
    @Post("getUsers")
    getUsers() {
        return this.userService.getUsers();
    }
}  
