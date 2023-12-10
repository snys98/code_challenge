import { Controller, Post, Logger, UseGuards, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@Controller('users')
export class UserController {
    private readonly logger = new Logger(UserController.name);
    constructor(private readonly userService: UserService,
    ) { }

    @Post("seedData")
    seedData() {
        this.logger.log("Seeding data");
        this.userService.seedData();
    }

    @UseGuards(AuthGuard('local'))
    @Get()
    async getUsers(@CurrentUser() user: UserProfile) {
        this.logger.log(user);
        const users = await this.userService.getUsers();
        return users.map(user => user.toObject());
    }
}  
