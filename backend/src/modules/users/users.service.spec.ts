import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if email already exists', async () => {
      jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce({} as User);

      await expect(
        service.create('test@example.com', 'password'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create a new user if email does not exist', async () => {
      jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce(null);
      jest.spyOn(repository, 'create').mockReturnValue({
        email: 'test@example.com',
        password: 'password',
      } as User);
      jest.spyOn(repository, 'save').mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'password',
      } as User);

      const result = await service.create('test@example.com', 'password');
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        password: 'password',
      });
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user if found', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'password',
      } as User;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

      const result = await service.findOneByEmail('test@example.com');
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const result = await service.findOneByEmail('test@example.com');
      expect(result).toBeNull();
    });
  });
});
