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

@ApiTags('User')
@UseGuards(AuthGuard)
@ApiSecurity('bearerAuth')
@Controller('user')
export class UserController {
  constructor(
    private usersServices: UsersService,
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
}
