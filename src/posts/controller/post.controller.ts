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
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { z } from 'zod';
import { SchoolsService } from '@/services/school.service';
import { UsersService } from '@/services/user.service';
import { AuthGuard } from '@/auth/auth.guard';

const createPostScheme = z.object({
  title: z.string(),
  content: z.string(),
  isDraft: z.boolean(),
  status: z.boolean(),
  schoolId: z.coerce.string(),
  userId: z.coerce.number()
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

const getPostByKeyWord = z.object({
  search: z.coerce.string()
})

type CreatePost = z.infer<typeof createPostScheme>;
type GetPostById = z.infer<typeof getPostByIdScheme>;
type UpdatePost = z.infer<typeof updatePostScheme>;
type GetAllPosts = z.infer<typeof getAllPosts>;
type GetPostByKeyWord = z.infer<typeof getPostByKeyWord>;


@UseGuards(AuthGuard)
@Controller('post')
export class PostController {
  constructor(
    private postsService: PostsService,
    private schoolService: SchoolsService,
    private userService: UsersService
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

  @Get('school/:id')
  async getPostBySchoolId(
    @Param('id') id: number,
    @Query(new ZodValidationPipe(getAllPosts)) { page, limit }: GetAllPosts,
  ) {
    return await this.postsService.findPostBySchoolId(id, page, limit);
  }

  @Get('school/draft/:id')
  async getDraftPostBySchoolId(
    @Param('id') id: number,
    @Query(new ZodValidationPipe(getAllPosts)) { page, limit }: GetAllPosts,
  ) {
    return await this.postsService.findDraftPostBySchoolId(id, page, limit);
  }

  @Get('find/school')
  async getPostByKeyWord(@Query(new ZodValidationPipe(getPostByKeyWord)) { search }: GetPostByKeyWord) {
    return await this.postsService.findPostByKeyWord(search);
  }

  @Post()
  async createPost(
    @Body(new ZodValidationPipe(createPostScheme))
    { title, content, isDraft, schoolId,status,userId }: CreatePost,
    @Res() response: Response,
  ) {
    const user = await this.userService.findById(userId);

    if (!user) {
      return response.status(404).json('User not found');
    }

    const school = user.schools.find(x => { return x.id === schoolId});

    if (!school) {
      return response.status(404).json('School not found');
    }

    const result = await this.postsService.create({
      title,
      content,
      isDraft,
      status,
      user,
      school
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
