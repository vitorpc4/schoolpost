import { userSchoolAssociation } from '@/entities/models/userSchoolAssociation.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchoolAssociationController } from './controllers/association.controller';
import { UserSchoolAssociationService } from '@/services/userSchoolAssociation.service';
import { UsersModule } from '@/users/users.module';
import { SchoolModule } from '@/school/school.module';

@Module({
    imports: [TypeOrmModule.forFeature([userSchoolAssociation]), UsersModule, SchoolModule],
    providers: [UserSchoolAssociationService],
    controllers: [UserSchoolAssociationController],
    exports: [UserSchoolAssociationService]
})
export class UserSchoolAssociationModule {}
