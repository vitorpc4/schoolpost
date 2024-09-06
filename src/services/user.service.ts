import { IUser } from '@/entities/interfaces/user.interface';
import { User } from '@/entities/models/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(page: number, limit: number): Promise<IUser[]> {
    return await this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findById(id: number): Promise<IUser> {
    return await this.userRepository.findOneBy({ id });
  }

  async create(user: IUser): Promise<IUser> {
    return await this.userRepository.save(user);
  }

  async update(user: IUser): Promise<IUser> {
    return await this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
