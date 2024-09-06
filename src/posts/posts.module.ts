import { Post } from '@/entities/models/post.entity';
import { User } from '@/entities/models/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './controller/post.controller';
import { School } from '@/entities/models/school.entity';
import { UsersService } from '@/services/user.service';
import { SchoolsService } from '@/services/school.service';
import { PostsService } from '@/services/post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, School])],
  providers: [UsersService, SchoolsService, PostsService],
  controllers: [PostController],
})
export class PostsModule {}
