import { forwardRef, Module } from '@nestjs/common';
import { SchoolController } from './controller/school.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@/entities/models/post.entity';
import { User } from '@/entities/models/user.entity';
import { School } from '@/entities/models/school.entity';
import { SchoolsService } from '@/services/school.service';
import { UsersModule } from '@/users/users.module';
import { UserSchoolAssociationModule } from '@/user-school-association/user-school-association.module';
import { SharedModule } from '@/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, School]),
    forwardRef(() => UserSchoolAssociationModule),
    SharedModule,
    UsersModule,
  ],
  providers: [SchoolsService],
  controllers: [SchoolController],
  exports: [SchoolsService],
})
export class SchoolModule {}
