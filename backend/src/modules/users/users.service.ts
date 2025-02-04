import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(email: string, password: string): Promise<IUser> {
    if (await this.findOneByEmail(email)) {
      throw new BadRequestException('Email already exists');
    }
    const user = this.usersRepository.create({ email, password });
    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<IUser | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
