import { IPost } from '@/entities/interfaces/posts.interface';
import { Post } from '@/entities/models/post.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async findAll(page: number, limit: number): Promise<IPost[]> {
    return await this.postRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findById(id: number): Promise<IPost> {
    return await this.postRepository.findOneBy({ id });
  }

  async create(post: IPost): Promise<IPost> {
    return await this.postRepository.save(post);
  }

  async update(post: IPost): Promise<IPost> {
    return await this.postRepository.save(post);
  }

  async delete(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}
