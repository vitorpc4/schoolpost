import { userSchoolAssociation } from '@/entities/models/userSchoolAssociation.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchoolAssociationController } from './controllers/association.controller';
import { UserSchoolAssociationService } from '@/services/userSchoolAssociation.service';
import { UsersModule } from '@/users/users.module';
import { SchoolModule } from '@/school/school.module';
import { SharedModule } from '@/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([userSchoolAssociation]),
    UsersModule,
    forwardRef(() => SchoolModule),
    SharedModule,
  ],
  providers: [UserSchoolAssociationService],
  controllers: [UserSchoolAssociationController],
  exports: [UserSchoolAssociationService],
})
export class UserSchoolAssociationModule {}
