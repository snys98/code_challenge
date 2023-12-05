import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.entity';

const MongooseModules = [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])];
@Module({
    imports: [...MongooseModules],
    providers: [UserService,],
    controllers: [UserController],
    exports: [UserService, ...MongooseModules]
})
export class UserModule { }  
