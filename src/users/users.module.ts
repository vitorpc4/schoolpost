import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { Post } from '@/entities/models/post.entity';
import { User } from '@/entities/models/user.entity';
import { School } from '@/entities/models/school.entity';
import { UsersService } from '@/services/user.service';
import { SharedModule } from '@/shared/shared.module';
import { UserSchoolAssociationService } from '@/services/userSchoolAssociation.service';
import { UserSchoolAssociationModule } from '@/user-school-association/user-school-association.module';
import { SchoolModule } from '@/school/school.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, School]),
    SharedModule,
    forwardRef(() => UserSchoolAssociationModule),
    forwardRef(() => SchoolModule),
  ],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
