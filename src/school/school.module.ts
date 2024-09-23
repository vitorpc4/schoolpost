import { Module } from '@nestjs/common';
import { SchoolController } from './controller/school.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@/entities/models/post.entity';
import { User } from '@/entities/models/user.entity';
import { School } from '@/entities/models/school.entity';
import { SchoolsService } from '@/services/school.service';
import { PostsModule } from '@/posts/posts.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, School])],
  providers: [SchoolsService],
  controllers: [SchoolController],
  exports: [SchoolsService]
})
export class SchoolModule {}
