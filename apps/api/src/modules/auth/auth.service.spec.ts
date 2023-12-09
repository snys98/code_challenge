import '../../shared/extensions';

import { Cache } from 'cache-manager';

import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import { mockData } from '../../../test/mocks/data.mock';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken('User'),
                    // useValue: jest.fn(),
                    useValue: {
                        findOne: jest.fn().mockResolvedValue({
                            exec: jest.fn().mockResolvedValue(Promise.resolve({ ...mockData.users.test }))
                        })
                    },
                },
                AuthService,
                {
                    provide: Cache,
                    useValue: jest.fn().mockResolvedValue({
                        set: jest.fn().mockResolvedValue(Promise.resolve()),
                    } as Partial<Cache>)
                },
                {
                    provide: JwtService,
                    useValue: {
                        // sign: jest.fn().mockReturnValue('token'),
                        signAsync: jest.fn().mockReturnValue('token'),
                    } as Partial<JwtService>,
                },
            ]
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should validate user', async () => {
        expect(await service.validateUser('test', 'test')).toEqual({ id: "id", username: 'test', locked: false });
        expect(await service.validateUser('test', 'wrong')).toBeNull();
    });

    it('should generate token', async () => {
        expect(await service.signIn({ username: 'test', password: "test" })).toEqual({ id: "id", access_token: 'token' });
    });
});
