import { IUser } from '@/entities/interfaces/user.interface';
import { User } from '@/entities/models/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
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
    const user = this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<IUser> {
    const user = await this.userRepository
      .find({
        where: {
          email: email,
        },
      })
      .then((res) => {
        return res;
      });
    return user[0];
  }

  async create(user: IUser): Promise<IUser> {
    return await this.userRepository.save(user);
  }

  async update(user: IUser): Promise<IUser> {
    return await this.userRepository.save(user);
  }

  async delete(user: IUser): Promise<IUser> {
    return await this.userRepository.save(user);
  }
}
