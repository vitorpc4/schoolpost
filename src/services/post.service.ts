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

  async findPostBySchoolId(schoolId: number, page:number, limit: number): Promise<IPost[]> {
    const skip = (page - 1) * limit
    const take = limit

    return await this.postRepository.createQueryBuilder('post')
                .innerJoin('post.school', 'school')
                .where('school.id = :schoolId', { schoolId })
                .andWhere('post.status = true')
                .andWhere('post.is_draft=false')
                .skip(skip)
                .take(take)
                .getMany();
  }

  async findDraftPostBySchoolId(schoolId: number, page:number, limit: number): Promise<IPost[]> {
    const skip = (page - 1) * limit
    const take = limit

    return await this.postRepository.createQueryBuilder('post')
                .innerJoin('post.school', 'school')
                .where('school.id = :schoolId', { schoolId })
                .andWhere('post.status = true')
                .andWhere('post.is_draft=true')
                .skip(skip)
                .take(take)
                .getMany();
  }

  async findPostByKeyWord(search: string): Promise<IPost[]> {
    return await this.postRepository.createQueryBuilder('post')
                .where('post.title ILIKE :search', { search: `%${search}%` })
                .orWhere('post.content ILIKE :search', { search: `%${search}%` })
                .getMany();
  }
}
