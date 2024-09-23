import { Post } from '@/entities/models/post.entity';
import { User } from '@/entities/models/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './controller/post.controller';
import { School } from '@/entities/models/school.entity';
import { PostsService } from '@/services/post.service';
import { UserSchoolAssociationModule } from '@/user-school-association/user-school-association.module';

@Module({
  imports: [UserSchoolAssociationModule, TypeOrmModule.forFeature([Post, User, School])],
  providers: [PostsService],
  controllers: [PostController],
  exports: [PostsService]
})
export class PostsModule {}
