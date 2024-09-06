import { IPost } from '@/entities/interfaces/posts.interface';
import { PostsService } from '@/services/post.service';
import { ZodValidationPipe } from '@/pipe/zod-validation.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { z } from 'zod';
import { SchoolsService } from '@/services/school.service';

const createPostScheme = z.object({
  title: z.string(),
  content: z.string(),
  isDraft: z.boolean(),
  status: z.boolean(),
  schoolId: z.coerce.string(),
});

const updatePostScheme = z.object({
  title: z.string(),
  content: z.string(),
  isDraft: z.boolean(),
  status: z.boolean(),
});

const getPostByIdScheme = z.object({
  id: z.coerce.number(),
});

const getAllPosts = z.object({
  limit: z.coerce.number().default(10),
  page: z.coerce.number().default(1),
});

type CreatePost = z.infer<typeof createPostScheme>;
type GetPostById = z.infer<typeof getPostByIdScheme>;
type UpdatePost = z.infer<typeof updatePostScheme>;
type GetAllPosts = z.infer<typeof getAllPosts>;

@Controller('post')
export class PostController {
  constructor(
    private postsService: PostsService,
    private schoolService: SchoolsService,
  ) {}

  @Get()
  async getAllPosts(
    @Query(new ZodValidationPipe(getAllPosts)) { page, limit }: GetAllPosts,
  ) {
    return await this.postsService.findAll(page, limit);
  }

  @Get(':id')
  async getPostById(
    @Param(new ZodValidationPipe(getPostByIdScheme)) { id }: GetPostById,
  ) {
    return await this.postsService.findById(id);
  }

  @Post()
  async createPost(
    @Body(new ZodValidationPipe(createPostScheme))
    { title, content, isDraft, status, schoolId }: CreatePost,
    @Res() response: Response,
  ) {
    const school = await this.schoolService.findById(schoolId);

    if (!school) {
      return response.status(404).json('School not found');
    }

    const result = await this.postsService.create({
      title,
      content,
      isDraft,
      status,
      school,
    });

    return response.status(201).send(result);
  }

  @Put(':id')
  async updatePost(
    @Param(new ZodValidationPipe(getPostByIdScheme)) { id }: GetPostById,
    @Body(new ZodValidationPipe(updatePostScheme))
    { title, content, isDraft, status }: UpdatePost,
    @Res() response: Response,
  ) {
    let post = (await this.postsService.findById(id)) as IPost;

    if (!post) {
      return response.status(404).json('Post not found');
    }

    post.title = title;
    post.content = content;
    post.isDraft = isDraft;
    post.status = status;

    const result = await this.postsService.update(post);

    return response.status(200).send(result);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: number, @Res() response: Response) {
    await this.postsService.delete(id);

    return response.status(204).send();
  }
}
