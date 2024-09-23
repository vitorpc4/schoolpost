import { AuthGuard } from '@/auth/auth.guard';
import { ZodValidationPipe } from '@/pipe/zod-validation.pipe';
import { UserSchoolAssociationService } from '@/services/userSchoolAssociation.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { GetAllByNumberId, getAllByNumberId } from '../typesRequestZod/GetAllByNumberId';
import { Create, create } from '../typesRequestZod/Create';
import { IUserSchoolAssociation } from '@/entities/interfaces/userSchoolAssociation.interface';
import { UsersService } from '@/services/user.service';
import { SchoolsService } from '@/services/school.service';
import { update, Update } from '../typesRequestZod/Update';
import { Remove, remove } from '../typesRequestZod/Delete';
import { Pagination, pagination } from '../typesRequestZod/Pagination';
import { getAllByString, GetAllByString } from '../typesRequestZod/GetAllByString';

@UseGuards(AuthGuard)
@Controller('association')
export class UserSchoolAssociationController {
    constructor(
        private userSchoolAssociationService: UserSchoolAssociationService,
        private usersService: UsersService,
        private schoolService: SchoolsService
    ) {}

    @Get('user/:id')
    async getAllUserSchoolAssociationByUserId(
        @Param(new ZodValidationPipe(getAllByNumberId)) {id} : GetAllByNumberId
    ) 
    {
        return await this.userSchoolAssociationService.findAllByUserId(id);
    }

    @Get('school/:id')
    async GetAllUserSchoolAssociationBySchoolId(
        @Param(new ZodValidationPipe(getAllByString)) {id} : GetAllByString
    )
    {
        return await this.userSchoolAssociationService.findAllBySchoolId(id);
    }

    @Post()
    async CreateSchoolAssociation(@Body(new ZodValidationPipe(create)) {userId, schoolId, status, typeUser, admin} : Create) {
        const user = await this.usersService.findById(userId);

        if (!user) {
            return;
        }

        const school = await this.schoolService.findById(schoolId);

        if (!school) {
            return;
        }

        const userSchoolAssociation : IUserSchoolAssociation = {
            user: user,
            school: school,
            admin: admin,
            status: status,
            typeUser: typeUser,
        }

        const result = await this.userSchoolAssociationService.create(userSchoolAssociation);

        return result;
    }

    @Put(':id')
    async UpdateSchoolAssociation(
        @Body(new ZodValidationPipe(update)) { userId, schoolId, status, typeUser, admin } : Update,
        @Param(new ZodValidationPipe(getAllByNumberId)) { id } : GetAllByNumberId) 
    {
        const getAssociation = await this.userSchoolAssociationService.findById(id);

        if (!getAssociation) {
            return;
        }

        const user = await this.usersService.findById(userId);

        if (!user) {
            return;
        }

        const school = await this.schoolService.findById(schoolId);

        if (!school) {
            return;
        }

        getAssociation.user = user;
        getAssociation.school = school;
        getAssociation.admin = admin;
        getAssociation.status = status;
        getAssociation.typeUser = typeUser;

        const result = await this.userSchoolAssociationService.update(getAssociation);

        return result.id;
    }

    @Delete(':id')
    async DeleteSchoolAssociation(@Param(new ZodValidationPipe(remove)) { id } : Remove) {
        return await this.userSchoolAssociationService.delete(id);
    }

}
