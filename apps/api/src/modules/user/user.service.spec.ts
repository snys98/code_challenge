import '../../shared/extensions';

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { mockData } from '../../../test/mocks/data.mock';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken('User'),
          useValue: {
            findOne: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(Object.assign(mockData.users.test, {
                save: jest.fn().mockResolvedValue(true),
              }))
            })
          },
        },
        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should lock user', async () => {
    await service.lockUser(mockData.users.test.id);
    // since we mock the "save" method to always return true,  
    // it is expected that the lockUser method will also return true  
    expect(mockData.users.test.locked).toBe(true);
  });
});
