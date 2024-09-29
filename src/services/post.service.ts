import { IPost } from '@/entities/interfaces/posts.interface';
import { Post } from '@/entities/models/post.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async findAll(page: number, limit: number, ids: number[]): Promise<IPost[]> {
    const skip = (page - 1) * limit;
    const take = limit;
    return await this.postRepository
      .createQueryBuilder('post')
      .where('post.userSchoolAssociationId IN (:...ids)', { ids: ids })
      .andWhere('post.status = true')
      .andWhere('post.is_draft=false')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async findById(id: number): Promise<IPost> {
    const result = await this.postRepository.findOneBy({
      id: id,
      status: true,
    });

    if (!result) {
      throw new NotFoundException('Post not found');
    }

    return result;
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

  async findPostByAssociationId(
    associationId: number[],
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;
    return await this.postRepository
      .createQueryBuilder('post')
      .where('post.userSchoolAssociationId IN (:...ids)', {
        ids: associationId,
      })
      .andWhere('post.status = true')
      .andWhere('post.is_draft=false')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async findDraftsByAssociationId(
    associationId: number[],
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;

    return await this.postRepository
      .createQueryBuilder('post')
      .where('post.userSchoolAssociationId IN (:...ids)', {
        ids: associationId,
      })
      .andWhere('post.status = true')
      .andWhere('post.is_draft=true')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async findPostByKeyWord(
    associationId: number[],
    search: string,
    page: number,
    limit: number,
  ): Promise<IPost[]> {
    return await this.postRepository
      .createQueryBuilder('post')
      .where('post.userSchoolAssociationId IN (:...ids)', {
        ids: associationId,
      })
      .andWhere('post.status = true')
      .andWhere('post.is_draft=false')
      .andWhere(
        new Brackets((qb) => {
          qb.where('post.title ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('post.content ILIKE :search', { search: `%${search}%` });
        }),
      )
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async findPostDraftsByKeyWord(
    associationId: number[],
    search: string,
    page: number,
    limit: number,
  ): Promise<IPost[]> {
    return await this.postRepository
      .createQueryBuilder('post')
      .where('post.userSchoolAssociationId IN (:...ids)', {
        ids: associationId,
      })
      .andWhere('post.status = true')
      .andWhere('post.is_draft = true')
      .andWhere(
        new Brackets((qb) => {
          qb.where('post.title ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('post.content ILIKE :search', { search: `%${search}%` });
        }),
      )
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }
}
