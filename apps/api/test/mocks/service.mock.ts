import { ModuleMetadata } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';

import { AuthService } from '../../src/modules/auth/auth.service';
import { UserService } from '../../src/modules/user/user.service';
import { SharedModule } from '../../src/shared/shared.module';
import { mockData } from './data.mock';

const SharedTestModule = {
    imports: [SharedModule],
    providers: [
        {
            provide: getModelToken('User'),
            useValue: {
                findOne: jest.fn().mockResolvedValue({
                    exec: jest.fn().mockResolvedValue({ ...mockData.users.test })
                })
            },
        },
        {
            provide: JwtService,
            useValue: {}
        },
        AuthService,
        {
            provide: UserService,
            useValue: {
                validateUser: jest.fn().mockResolvedValue({ ...mockData.users.test }),
            },
        },
        {
            provide: JwtService,
            useValue: {
                sign: jest.fn().mockReturnValue(mockData.token),
            },
        },
    ],
} as ModuleMetadata;

export default SharedTestModule;
