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
    const query = await this.postRepository
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
      .where('p.id = :id', { id: id })
      .innerJoin('p.userSchoolAssociation', 'usa')
      .innerJoin('usa.user', 'u')
      .getRawOne();

    if (!query) {
      throw new NotFoundException('Post not found');
    }

    const post: IPost = {
      id: query.p_id,
      title: query.p_title,
      content: query.p_content,
      isDraft: query.is_draft,
      createdAt: new Date(query.p_created_at),
      updatedAt: new Date(query.p_updated_at),
      status: query.p_status,
      username: query.u_username,
      userSchoolAssociation: query.userSchoolAssociationId,
    };

    return post;
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

    const queryPosts = await this.postRepository
      .createQueryBuilder('post')
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.is_draft',
        'post.createdAt',
        'post.updatedAt',
        'post.status',
        'post.userSchoolAssociationId',
        'u.username',
      ])
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
      .innerJoin('post.userSchoolAssociation', 'usa')
      .innerJoin('usa.user', 'u')
      .skip(skip)
      .take(take)
      .getRawMany();

    const posts: IPost[] = queryPosts.map((raw) => ({
      id: raw.post_id,
      title: raw.post_title,
      content: raw.post_content,
      isDraft: raw.is_draft,
      createdAt: new Date(raw.post_created_at),
      updatedAt: new Date(raw.post_updated_at),
      status: raw.post_status,
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
