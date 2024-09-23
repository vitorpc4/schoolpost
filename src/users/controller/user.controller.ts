import { AuthGuard } from '@/auth/auth.guard';
import { ISchool } from '@/entities/interfaces/school.interface';
import { IUser } from '@/entities/interfaces/user.interface';
import { TypeUser } from '@/entities/models/userSchoolAssociation.entity';
import { ZodValidationPipe } from '@/pipe/zod-validation.pipe';
import { SchoolsService } from '@/services/school.service';
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
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { z } from 'zod';

const createUserScheme = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  status: z.boolean().default(true),
});

const updateUserScheme = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  status: z.boolean()
});

const getUsersByIdScheme = z.object({
  id: z.coerce.number(),
});

const getAllUsers = z.object({
  limit: z.coerce.number().default(10),
  page: z.coerce.number().default(1),
});

type CreateUser = z.infer<typeof createUserScheme>;
type GetUserById = z.infer<typeof getUsersByIdScheme>;
type Updateuser = z.infer<typeof updateUserScheme>;
type GetAllUsers = z.infer<typeof getAllUsers>;


@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private usersServices: UsersService,
  ) {}

  @Get()
  async getAllUser(
    @Query(new ZodValidationPipe(getAllUsers)) { page, limit }: GetAllUsers,
  ) {
    return await this.usersServices.findAll(page, limit);
  }

  @Get(':id')
  async getUserById(
    @Param(new ZodValidationPipe(getUsersByIdScheme)) { id }: GetUserById,
  ) {
    return await this.usersServices.findById(id);
  }

  @Post()
  async createUser(
    @Body(new ZodValidationPipe(createUserScheme))
    {
      username,
      email,
      password,
      status
    }: CreateUser,
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
    @Param(new ZodValidationPipe(getUsersByIdScheme)) { id }: GetUserById,
    @Body(new ZodValidationPipe(updateUserScheme))
    { username, email, status }: Updateuser,
    @Res() response: Response,) {
      let user = (await this.usersServices.findById(id))
      
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
