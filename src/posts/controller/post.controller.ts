import { IPost } from '@/entities/interfaces/posts.interface';
import { PostsService } from '@/services/post.service';
import { ZodValidationPipe } from '@/pipe/zod-validation.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@/auth/auth.guard';
import { CreatePost, createPostScheme } from '../TypesRequestZod/CreatePost.Type';
import { UpdatePost, updatePostScheme } from '../TypesRequestZod/UpdatePost.Type';
import { GetPostById, getPostByIdScheme } from '../TypesRequestZod/GetPostById.Type';
import { GetAllPosts, getAllPosts } from '../TypesRequestZod/GetAllPost.Type';
import { GetPostByKeyWord, getPostByKeyWord } from '../TypesRequestZod/GetPostByKeyWord';
import { UserSchoolAssociationService } from '@/services/userSchoolAssociation.service';
import { TypeUser } from '@/entities/models/userSchoolAssociation.entity';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostController {
  constructor(
    private userSchoolAssociationService: UserSchoolAssociationService,
    private postsService: PostsService,
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
    @Param('id') id: string,
    @Query(new ZodValidationPipe(getAllPosts)) { page, limit }: GetAllPosts,
  ) {
    const result = await this.userSchoolAssociationService.findAllBySchoolIdAndTypeUser(id, TypeUser.Professor);

    const getAssociationsIds = result.map((item) => item.id);

    const posts = await this.postsService.findPostByAssociationId(getAssociationsIds, page, limit);

    return posts;
  }

  @Get('school/draft/:id')
  async getDraftPostBySchoolId(
    @Param('id') id: string,
    @Query(new ZodValidationPipe(getAllPosts)) { page, limit }: GetAllPosts,
  ) {
    const result = await this.userSchoolAssociationService.findAllBySchoolIdAndTypeUser(id, TypeUser.Professor);

    const getAssociationsIds = result.map((item) => item.id);

    return await this.postsService.findDraftsByAssociationId(getAssociationsIds, page, limit);
  }

  @Get('find/school')
  async getPostByKeyWord(@Query(new ZodValidationPipe(getPostByKeyWord)) { search }: GetPostByKeyWord,
    @Query(new ZodValidationPipe(getAllPosts)) { page, limit }: GetAllPosts,
    @Headers('X-SchoolId') id: string) {

    const result = await this.userSchoolAssociationService.findAllBySchoolIdAndTypeUser(id, TypeUser.Professor);

    const getAssociationsIds = result.map((item) => item.id);

    return await this.postsService.findPostByKeyWord(getAssociationsIds, search, page, limit);
  }

  @Post()
  async createPost(
    @Body(new ZodValidationPipe(createPostScheme))
    { title, content, isDraft,status,associationSchool }: CreatePost,
    @Res() response: Response,
  ) {
    const userSchoolAssociation = await this.userSchoolAssociationService.findById(associationSchool);

    if (!userSchoolAssociation) {
      return response.status(404).json('User School Association not found');
    }

    const result = await this.postsService.create({
      title,
      content,
      isDraft,
      status,
      userSchoolAssociation
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
