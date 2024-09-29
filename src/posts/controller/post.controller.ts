import { IPost } from '@/entities/interfaces/posts.interface';
import { PostsService } from '@/services/post.service';
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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { response, Response } from 'express';
import { AuthGuard } from '@/auth/auth.guard';

import { UserSchoolAssociationService } from '@/services/userSchoolAssociation.service';
import { TypeUser } from '@/entities/models/userSchoolAssociation.entity';
import { ApiTags } from '@nestjs/swagger';
import { GetAllPostDTO } from '../DTOS/getAllPost.dto';
import { GetPostByIdDTO } from '../DTOS/getPostById.dto';
import { GetPostByKeyWordDTO } from '../DTOS/getPostByKeyWord.dto';
import { CreatePostDTO } from '../DTOS/createPost.dto';
import { UpdatePostDTO } from '../DTOS/updatePost.dto';
import { headerDTO } from '@/Utils/dtos/header.dto';
import { GlobalTokenService } from '@/shared/globalTokenService';

@ApiTags('Post')
@UseGuards(AuthGuard)
@Controller('posts')
export class PostController {
  constructor(
    private userSchoolAssociationService: UserSchoolAssociationService,
    private postsService: PostsService,
    private readonly globalTokenService: GlobalTokenService,
  ) {}

  @Get()
  async getAllPosts(
    @Query() { page, limit }: GetAllPostDTO,
    @Headers() { schoolid }: headerDTO,
    @Res() response: Response,
  ) {
    const decoded = this.globalTokenService.getDecodedToken();

    if (decoded.schools.filter((x) => x.schoolId == schoolid).length == 0) {
      return response.status(403).json({
        message: 'User Not Authorized To get this posts',
      });
    }

    const associations =
      await this.userSchoolAssociationService.findAllBySchoolId(schoolid);

    const ids = associations.map((item) => item.id);

    const result = await this.postsService.findAll(page, limit, ids);

    response.status(200).json(result);
  }

  @Get('drafts')
  async getAllPostsDrafts(
    @Query() { page, limit }: GetAllPostDTO,
    @Headers() { schoolid }: headerDTO,
    @Res() response: Response,
  ) {
    const decoded = this.globalTokenService.getDecodedToken();

    const school = decoded.schools.find((x) => x.schoolId == schoolid);

    if (!school) {
      return response.status(403).json({
        message: 'User Not Authorized To get this posts',
      });
    }

    if (school.typeUser != TypeUser.Professor) {
      return response.status(403).json({
        message: 'User Not Authorized To get this posts',
      });
    }

    const associations =
      await this.userSchoolAssociationService.findAllBySchoolId(schoolid);

    const ids = associations.map((item) => item.id);

    const result = await this.postsService.findDraftsByAssociationId(
      ids,
      page,
      limit,
    );

    response.status(200).json(result);
  }

  @Get(':id')
  async getPostById(
    @Param() { id }: GetPostByIdDTO,
    @Headers() { schoolid }: headerDTO,
    @Res() response: Response,
  ) {
    const decoded = this.globalTokenService.getDecodedToken();

    if (decoded.schools.filter((x) => x.schoolId == schoolid).length == 0) {
      return response.status(403).json({
        message: 'User Not Authorized To get this posts',
      });
    }

    const school = decoded.schools.find((x) => x.schoolId == schoolid);

    const result = await this.postsService.findById(id);

    if (result.isDraft) {
      if (school.typeUser != TypeUser.Professor) {
        return response.status(403).json({
          message: 'User Not Authorized To get this posts',
        });
      }
    }

    response.status(200).json(result);
  }

  @Get('find/school')
  async getPostByKeyWord(
    @Query()
    { search }: GetPostByKeyWordDTO,
    @Query() { page, limit }: GetAllPostDTO,
    @Headers() { schoolid }: headerDTO,
  ) {
    const decoded = this.globalTokenService.getDecodedToken();

    if (decoded.schools.filter((x) => x.schoolId == schoolid).length == 0) {
      return response.status(403).json({
        message: 'User Not Authorized To get this posts',
      });
    }

    const result =
      await this.userSchoolAssociationService.findAllBySchoolId(schoolid);

    const getAssociationsIds = result.map((item) => item.id);

    return await this.postsService.findPostByKeyWord(
      getAssociationsIds,
      search,
      page,
      limit,
    );
  }

  @Get('finddraft/school')
  async getPostDraftByKeyWord(
    @Query()
    { search }: GetPostByKeyWordDTO,
    @Query() { page, limit }: GetAllPostDTO,
    @Headers() { schoolid }: headerDTO,
  ) {
    const decoded = this.globalTokenService.getDecodedToken();

    const school = decoded.schools.find((x) => x.schoolId == schoolid);

    if (!school) {
      return response.status(403).json({
        message: 'User Not Authorized To get this posts',
      });
    }

    if (school.typeUser != TypeUser.Professor) {
      return response.status(403).json({
        message: 'User Not Authorized To get this posts',
      });
    }
    const result =
      await this.userSchoolAssociationService.findAllBySchoolId(schoolid);

    const getAssociationsIds = result.map((item) => item.id);

    return await this.postsService.findPostDraftsByKeyWord(
      getAssociationsIds,
      search,
      page,
      limit,
    );
  }

  @Post()
  async createPost(
    @Body()
    { title, content, isDraft, status, associationSchool }: CreatePostDTO,
    @Res() response: Response,
    @Headers() { schoolid }: headerDTO,
  ) {
    const decoded = this.globalTokenService.getDecodedToken();

    const school = decoded.schools.find((x) => x.schoolId == schoolid);

    if (!school) {
      return response.status(403).json({
        message: 'User Not Authorized To Create Posts For this School',
      });
    }

    if (school.typeUser != TypeUser.Professor) {
      return response.status(403).json({
        message: 'User Not Authorized To Create posts',
      });
    }

    const userSchoolAssociation =
      await this.userSchoolAssociationService.findById(associationSchool);

    if (!userSchoolAssociation) {
      return response.status(404).json('User School Association not found');
    }

    const result = await this.postsService.create({
      title,
      content,
      isDraft,
      status,
      userSchoolAssociation,
    });

    return response.status(201).send(result);
  }

  @Put(':id')
  async updatePost(
    @Param() { id }: GetPostByIdDTO,
    @Body()
    { title, content, isDraft, status }: UpdatePostDTO,
    @Res() response: Response,
    @Headers() { schoolid }: headerDTO,
  ) {
    const decoded = this.globalTokenService.getDecodedToken();

    const school = decoded.schools.find((x) => x.schoolId == schoolid);

    if (!school) {
      return response.status(403).json({
        message: 'User Not Authorized To Update Posts For this School',
      });
    }

    if (school.typeUser != TypeUser.Professor) {
      return response.status(403).json({
        message: 'User Not Authorized To Update posts',
      });
    }

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
  async deletePost(
    @Param('id') id: number,
    @Res() response: Response,
    @Headers() { schoolid }: headerDTO,
  ) {
    const decoded = this.globalTokenService.getDecodedToken();

    const school = decoded.schools.find((x) => x.schoolId == schoolid);

    if (!school) {
      return response.status(403).json({
        message: 'User Not Authorized To Delete Posts For this School',
      });
    }

    if (school.typeUser != TypeUser.Professor) {
      return response.status(403).json({
        message: 'User Not Authorized To Delete posts',
      });
    }

    await this.postsService.delete(id);

    return response.status(204).send();
  }
}
