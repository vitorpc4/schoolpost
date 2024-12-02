import { IPost } from '@/entities/interfaces/posts.interface';
import { Post } from '@/entities/models/post.entity';
import { GetAllPostResponse } from '@/posts/DTOS/Response/GetAllPostResponse';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async findAll(
    page: number,
    limit: number,
    ids: number[],
  ): Promise<GetAllPostResponse> {
    const skip = (page - 1) * limit;
    const take = limit;

    const countTotalItems = await this.postRepository
      .createQueryBuilder('post')
      .where('post.userSchoolAssociationId IN (:...ids)', { ids: ids })
      .andWhere('post.status = true')
      .andWhere('post.is_draft=false')
      .getCount();

    const totalPages = Math.ceil(countTotalItems / limit);

    const queryPosts = await this.postRepository
      .createQueryBuilder('p')
      .select([
        'p.id',
        'p.title',
        'p.content',
        'p.is_draft',
        'p.createdAt',
        'p.updatedAt',
        'p.status',
        'p.userSchoolAssociationId',
        'u.username',
      ])
      .where('p.userSchoolAssociationId IN (:...ids)', { ids: ids })
      .andWhere('p.status = true')
      .andWhere('p.is_draft=false')
      .innerJoin('p.userSchoolAssociation', 'usa')
      .innerJoin('usa.user', 'u')
      .limit(take)
      .offset(skip)
      .getRawMany();

    const posts: IPost[] = queryPosts.map((raw) => ({
      id: raw.p_id,
      title: raw.p_title,
      content: raw.p_content,
      isDraft: raw.is_draft,
      createdAt: new Date(raw.p_created_at),
      updatedAt: new Date(raw.p_updated_at),
      status: raw.p_status,
      username: raw.u_username,
      userSchoolAssociation: raw.userSchoolAssociationId,
    }));

    const result: GetAllPostResponse = {
      totalItems: countTotalItems,
      totalPages: totalPages,
      posts: posts,
    };

    return result;
  }

  async GetPublishedPostsAndDrafts(
    page: number,
    limit: number,
    ids: number[],
  ): Promise<GetAllPostResponse> {
    const skip = (page - 1) * limit;
    const take = limit;

    const countTotalItems = await this.postRepository
      .createQueryBuilder('post')
      .where('post.userSchoolAssociationId IN (:...ids)', { ids: ids })
      .andWhere('post.status = true')
      .getCount();

    const totalPages = Math.ceil(countTotalItems / limit);

    const queryPosts = await this.postRepository
      .createQueryBuilder('p')
      .select([
        'p.id',
        'p.title',
        'p.content',
        'p.is_draft',
        'p.createdAt',
        'p.updatedAt',
        'p.status',
        'p.userSchoolAssociationId',
        'u.username',
      ])
      .where('p.userSchoolAssociationId IN (:...ids)', { ids: ids })
      .andWhere('p.status = true')
      .innerJoin('p.userSchoolAssociation', 'usa')
      .innerJoin('usa.user', 'u')
      .limit(take)
      .offset(skip)
      .getRawMany();

    const posts: IPost[] = queryPosts.map((raw) => ({
      id: raw.p_id,
      title: raw.p_title,
      content: raw.p_content,
      isDraft: raw.is_draft,
      createdAt: new Date(raw.p_created_at),
      updatedAt: new Date(raw.p_updated_at),
      status: raw.p_status,
      username: raw.u_username,
      userSchoolAssociation: raw.userSchoolAssociationId,
    }));

    const result: GetAllPostResponse = {
      totalItems: countTotalItems,
      totalPages: totalPages,
      posts: posts,
    };

    return result;
  }

  async GetPublishedPostsAndDraftsByKeyWord(
    page: number,
    limit: number,
    ids: number[],
    search: string,
  ): Promise<GetAllPostResponse> {
    const skip = (page - 1) * limit;
    const take = limit;

    const countTotalItems = await this.postRepository
      .createQueryBuilder('post')
      .where('post.userSchoolAssociationId IN (:...ids)', { ids: ids })
      .andWhere('post.status = true')
      .andWhere(
        new Brackets((qb) => {
          qb.where('post.title ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('post.content ILIKE :search', { search: `%${search}%` });
        }),
      )
      .getCount();

    const totalPages = Math.ceil(countTotalItems / limit);

    const queryPosts = await this.postRepository
      .createQueryBuilder('p')
      .select([
        'p.id',
        'p.title',
        'p.content',
        'p.is_draft',
        'p.createdAt',
        'p.updatedAt',
        'p.status',
        'p.userSchoolAssociationId',
        'u.username',
      ])
      .where('p.userSchoolAssociationId IN (:...ids)', { ids: ids })
      .andWhere('p.status = true')
      .andWhere(
        new Brackets((qb) => {
          qb.where('p.title ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('p.content ILIKE :search', { search: `%${search}%` });
        }),
      )
      .innerJoin('p.userSchoolAssociation', 'usa')
      .innerJoin('usa.user', 'u')
      .limit(take)
      .offset(skip)
      .getRawMany();

    const posts: IPost[] = queryPosts.map((raw) => ({
      id: raw.p_id,
      title: raw.p_title,
      content: raw.p_content,
      isDraft: raw.is_draft,
      createdAt: new Date(raw.p_created_at),
      updatedAt: new Date(raw.p_updated_at),
      status: raw.p_status,
      username: raw.u_username,
      userSchoolAssociation: raw.userSchoolAssociationId,
    }));

    const result: GetAllPostResponse = {
      totalItems: countTotalItems,
      totalPages: totalPages,
      posts: posts,
    };

    return result;
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
  ): Promise<GetAllPostResponse> {
    const skip = (page - 1) * limit;
    const take = limit;

    const countTotalItems = await this.postRepository
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
      .getCount();

    const totalPages = Math.ceil(countTotalItems / limit);

    const posts = await this.postRepository
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
      .skip(skip)
      .take(take)
      .getMany();

    const result: GetAllPostResponse = {
      totalItems: countTotalItems,
      totalPages: totalPages,
      posts: posts,
    };

    return result;
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
