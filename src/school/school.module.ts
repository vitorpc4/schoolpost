import { Module } from '@nestjs/common';
import { SchoolController } from './controller/school.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@/entities/models/post.entity';
import { User } from '@/entities/models/user.entity';
import { School } from '@/entities/models/school.entity';
import { UsersService } from '@/services/user.service';
import { SchoolsService } from '@/services/school.service';
import { PostsService } from '@/services/post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, School])],
  providers: [UsersService, SchoolsService, PostsService],
  controllers: [SchoolController],
})
export class SchoolModule {}
