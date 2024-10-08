import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { Post } from '@/entities/models/post.entity';
import { User } from '@/entities/models/user.entity';
import { School } from '@/entities/models/school.entity';
import { UsersService } from '@/services/user.service';
import { SharedModule } from '@/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, School]), SharedModule],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
