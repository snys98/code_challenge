import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user/user.service';
import { getModelToken } from '@nestjs/mongoose';

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getModelToken('User'),
                    useValue: {
                        findOne: jest.fn().mockResolvedValue({ username: 'test', password: 'test', locked: false }),
                        save: jest.fn().mockResolvedValue(true),
                    },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should validate user', async () => {
        expect(await service.validateUser('test', 'test')).toEqual({ username: 'test', locked: false });
        expect(await service.validateUser('test', 'wrong')).toBeNull();
    });

    it('should lock user', async () => {
        await service.lockUser('test');
        // since we mock the "save" method to always return true,  
        // it is expected that the lockUser method will also return true  
        expect(await service.lockUser('test')).toBe(true);
    });
});
