import { AuthGuard } from '@/auth/auth.guard';
import { UserSchoolAssociationService } from '@/services/userSchoolAssociation.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';

import { IUserSchoolAssociation } from '@/entities/interfaces/userSchoolAssociation.interface';
import { UsersService } from '@/services/user.service';
import { SchoolsService } from '@/services/school.service';
import { ApiTags } from '@nestjs/swagger';
import { GetAllByNumberIdDTO } from '../DTOS/getAllByNumberId.dto';
import { GetAllByStringDTO } from '../DTOS/getAllByString.dto';
import { CreateDTO } from '../DTOS/create.dto';
import { UpdateDTO } from '../DTOS/update.dto';
import { DeleteDTO } from '../DTOS/Delete.dto';
import { Request, Response } from 'express';
import { CreateInviteDto } from '@/school/DTOS/createInvite.dto';
import TokenProvider from '@/Utils/InviteToken';
import ValidToken from '@/Utils/validToken';
import { env } from '@/env';
import { GlobalTokenService } from '@/shared/globalTokenService';
@ApiTags('Association')
@UseGuards(AuthGuard)
@Controller('association')
export class UserSchoolAssociationController {
  constructor(
    private userSchoolAssociationService: UserSchoolAssociationService,
    private usersService: UsersService,
    private schoolService: SchoolsService,
    private readonly globalTokenService: GlobalTokenService,
  ) {}

  @Get('user/:id')
  async getAllUserSchoolAssociationByUserId(
    @Param() { id }: GetAllByNumberIdDTO,
    @Res() response: Response,
  ) {
    const decoded = this.globalTokenService.getDecodedToken();

    const isAdminInSomeSchool = decoded.schools
      .filter((x) => x.admin == true)
      .map((x) => x.schoolId);

    if (!isAdminInSomeSchool) {
      return response.status(HttpStatus.FORBIDDEN).json({
        message: 'User not authorized to get any information',
      });
    }

    const getUsers =
      await this.userSchoolAssociationService.findAllByUserIdAndSchool(
        id,
        isAdminInSomeSchool,
      );

    return response.status(200).json(getUsers);
  }

  @Get('school/:id')
  async GetAllUserSchoolAssociationBySchoolId(
    @Param() { id }: GetAllByStringDTO,
    @Res() response: Response,
  ) {
    const decoded = this.globalTokenService.getDecodedToken();

    const schoolFind = decoded.schools.find((x) => x.schoolId == id);

    if (!schoolFind) {
      return response.status(HttpStatus.FORBIDDEN).json({
        message: 'User not authorized to get this information',
      });
    }

    if (!schoolFind.admin) {
      return response.status(HttpStatus.FORBIDDEN).json({
        message: 'User not authorized to get this information',
      });
    }

    return await this.userSchoolAssociationService.findAllBySchoolId(id);
  }

  @Post('invite')
  async InviteUserToSchool(
    @Body()
    { school, admin, typeUser }: CreateInviteDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const decoded = this.globalTokenService.getDecodedToken();
    const schoolFind = decoded.schools.find((x) => x.schoolId == school);

    if (!schoolFind) {
      return response.status(HttpStatus.FORBIDDEN).json({
        message: 'User not authorized to invite to this school',
      });
    }

    if (!schoolFind.admin) {
      return response.status(HttpStatus.FORBIDDEN).json({
        message: 'User not authorized to create inviteLinks',
      });
    }

    const urlBase = request.get('Host');

    const generateToken = new TokenProvider(
      school,
      typeUser,
      admin,
      urlBase,
      env.JWT_SECRET_INVITE,
    );

    const token = await generateToken.getIdToken();

    const urlInvite = `${urlBase}/association/validtoken?token=${token}`;

    return response.status(201).json({ urlInvite });
  }

  @Post('validtoken')
  async CheckToken(
    @Query() token: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const decoded = this.globalTokenService.getDecodedToken();

    const jwt = require('jsonwebtoken');

    const urlBase = request.get('Host');

    const checkTokenInvite = new ValidToken(
      env.JWT_SECRET_INVITE,
      urlBase,
      token,
    );

    const result = await checkTokenInvite.decodeToken();

    const user = await this.usersService.findById(decoded.sub);

    const school = await this.schoolService.findById(result.school);

    const associaction: IUserSchoolAssociation = {
      user: user,
      school: school,
      admin: result.admin,
      status: true,
      typeUser: result.typeUser,
    };

    this.userSchoolAssociationService.create(associaction);

    const schoolInfo = {
      schoolId: result.school,
      typeUser: result.typeUser,
      admin: result.admin,
    };

    decoded.schools.push(schoolInfo);

    const newAuthToken = jwt.sign(
      {
        sub: decoded.sub,
        userName: decoded.userName,
        iat: decoded.iat,
        exp: decoded.exp,
        schools: decoded.schools,
      },
      env.JWT_SECRET,
    );

    return response.status(200).json({ authorization: newAuthToken });
  }

  @Post()
  async CreateSchoolAssociation(
    @Body()
    { userId, schoolId, status, typeUser, admin }: CreateDTO,
    @Res() response: Response,
  ) {
    const decoded = this.globalTokenService.getDecodedToken();

    const schoolFind = decoded.schools.find((x) => x.schoolId == schoolId);

    if (!schoolFind) {
      return response.status(HttpStatus.FORBIDDEN).json({
        message: 'User not authorized to create association',
      });
    }

    if (!schoolFind.admin) {
      return response.status(HttpStatus.FORBIDDEN).json({
        message: 'User not authorized to create association',
      });
    }

    const user = await this.usersService.findById(userId);

    const school = await this.schoolService.findById(schoolId);

    const userSchoolAssociation: IUserSchoolAssociation = {
      user: user,
      school: school,
      admin: admin,
      status: status,
      typeUser: typeUser,
    };

    const result = await this.userSchoolAssociationService.create(
      userSchoolAssociation,
    );

    return response.status(201).json(result);
  }

  @Put(':id')
  async UpdateSchoolAssociation(
    @Body()
    { userId, schoolId, status, typeUser, admin }: UpdateDTO,
    @Param() { id }: GetAllByNumberIdDTO,
    @Res() response: Response,
  ) {
    const decoded = this.globalTokenService.getDecodedToken();

    const schoolFind = decoded.schools.find((x) => x.schoolId == schoolId);

    if (!schoolFind) {
      return response.status(HttpStatus.FORBIDDEN).json({
        message: 'User not authorized to update association',
      });
    }

    if (schoolFind.admin) {
      return response.status(HttpStatus.FORBIDDEN).json({
        message: 'User not authorized to update association',
      });
    }

    const getAssociation = await this.userSchoolAssociationService.findById(id);

    if (!getAssociation) {
      return;
    }

    const user = await this.usersService.findById(userId);

    const school = await this.schoolService.findById(schoolId);

    getAssociation.user = user;
    getAssociation.school = school;
    getAssociation.admin = admin;
    getAssociation.status = status;
    getAssociation.typeUser = typeUser;

    const result =
      await this.userSchoolAssociationService.update(getAssociation);

    return result.id;
  }

  @Delete(':id')
  async DeleteSchoolAssociation(
    @Param() { id }: DeleteDTO,
    @Res() response: Response,
  ) {
    const decoded = this.globalTokenService.getDecodedToken();

    const getAssociation = await this.userSchoolAssociationService.findById(id);

    const schoolFind = decoded.schools.find(
      (x) => x.schoolId == getAssociation.school.id,
    );

    if (!schoolFind) {
      return response.status(HttpStatus.FORBIDDEN).json({
        message: 'User not authorized to delete association',
      });
    }

    if (!schoolFind.admin) {
      return response.status(HttpStatus.FORBIDDEN).json({
        message: 'User not authorized to delete association',
      });
    }

    await this.userSchoolAssociationService.delete(id);

    return response.status(204).json();
  }
}
