import { AuthGuard } from '@/auth/auth.guard';
import { UsersService } from '@/services/user.service';
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
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { createUserDTO } from '../DTOS/createUser.dto';
import { UpdateUserDTO } from '../DTOS/updateUser.dto';
import { GetUserByIdDTO } from '../DTOS/getUserById.dto';
import { GetAllUsersDTO } from '../DTOS/getAllUsers.dto';
import { env } from '@/env';
import { GlobalTokenService } from '@/shared/globalTokenService';
import { get } from 'http';
import { createUserAndAssociationDTO } from '../DTOS/createUserAndAssociation.dto';
import { IUserSchoolAssociation } from '@/entities/interfaces/userSchoolAssociation.interface';
import { UserSchoolAssociationService } from '@/services/userSchoolAssociation.service';
import { SchoolsService } from '@/services/school.service';

@ApiTags('User')
@UseGuards(AuthGuard)
@ApiSecurity('bearerAuth')
@Controller('user')
export class UserController {
  constructor(
    private usersServices: UsersService,
    private associationService: UserSchoolAssociationService,
    private schoolService: SchoolsService,
    private readonly globalTokenService: GlobalTokenService,
  ) {}

  @Get()
  async getAllUser(@Query() { page, limit }: GetAllUsersDTO) {
    const users = await this.usersServices.findAll(page, limit);
    const result = users.map((user) => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    return result;
  }

  @Get(':id')
  async getUserById(@Param() { id }: GetUserByIdDTO, @Req() request: Request) {
    const decodedToken = this.globalTokenService.getDecodedToken();

    if (decodedToken.sub !== id) {
      return { message: 'User Not Authorized To get this information' };
    }

    return await this.usersServices.findById(id);
  }

  @Post()
  async createUser(
    @Body()
    { username, email, password, status }: createUserDTO,
    @Res() response: Response,
  ) {
    const result = await this.usersServices.create({
      username,
      email,
      password,
      status: status,
    });

    return response.status(201).json(result);
  }

  @Put(':id')
  async updateUser(
    @Param() { id }: GetUserByIdDTO,
    @Body()
    { username, email, status }: UpdateUserDTO,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const decodedToken = this.globalTokenService.getDecodedToken();

    if (decodedToken.sub !== id) {
      return { message: 'User Not Authorized To get this information' };
    }

    let user = await this.usersServices.findById(id);

    if (!user) {
      return response.status(404).json({ message: 'User not found' });
    }

    user.id = id;
    user.username = username;
    user.email = email;
    user.status = status;
    user.updatedAt = new Date();

    const result = await this.usersServices.update(user);

    return response.status(200).json(result);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number, @Res() response: Response) {
    const user = await this.usersServices.findById(id);
    user.status = false;
    user.updatedAt = new Date();
    await this.usersServices.delete(user);

    return response.status(204).send();
  }

  @Post('createUserAndAssociation')
  async CreateUserAndAssociation(
    @Body()
    {
      username,
      email,
      password,
      status,
      schoolId,
      typeUser,
      admin,
    }: createUserAndAssociationDTO,
    @Res() response: Response,
  ) {
    const getUserByEmail = await this.usersServices.findUserByEmail(email);

    if (getUserByEmail) {
      return response.status(400).json({ message: 'Email already exist' });
    }

    const user = await this.usersServices.create({
      username: username,
      email: email,
      password: password,
      status: true,
      createdAt: new Date(),
    });

    const school = await this.schoolService.findById(schoolId);

    if (!school) {
      return response.status(404).json({ message: 'School not found' });
    }

    const userSchoolAssociation: IUserSchoolAssociation = {
      user: user,
      school: school,
      admin: admin,
      status: status,
      typeUser: typeUser,
    };

    const result = await this.associationService.create(userSchoolAssociation);

    return response.status(201).json();
  }
}
