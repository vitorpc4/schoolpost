import { ISchool } from '@/entities/interfaces/school.interface';
import { IUser } from '@/entities/interfaces/user.interface';
import { TypeUser } from '@/entities/models/user.entity';
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
} from '@nestjs/common';
import { Response } from 'express';
import { promise, z } from 'zod';

const createUserScheme = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  admin: z.boolean(),
  status: z.boolean(),
  TypeUser: z.nativeEnum(TypeUser),
  schoolIds: z.array(z.coerce.string().uuid("Invalid UUID")).optional(),
});

const updateUserScheme = z.object({
  username: z.string(),
  email: z.string().email(),
  admin: z.boolean(),
  status: z.boolean(),
  TypeUser: z.nativeEnum(TypeUser),
  schoolIds: z.array(z.coerce.string().uuid("Invalid UUID")).optional(),
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

@Controller('user')
export class UserController {
  constructor(
    private usersServices: UsersService,
    private schoolsService: SchoolsService,
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
      admin,
      status,
      TypeUser,
      schoolIds,
    }: CreateUser,
    @Res() response: Response,
  ) {
    let schoolArrays: ISchool[] = [];

    if (schoolIds) {
      await Promise.all(
        schoolIds.map(async (element) => {
          const schools = await this.schoolsService.findById(element);
          schoolArrays.push(schools);
        }),
      );
    }

    const result = await this.usersServices.create({
      username,
      email,
      password,
      admin,
      status,
      TypeUser,
      schools: schoolArrays,
    });

    return response.status(201).json(result);
  }

  @Put(':id')
  async updateUser(
    @Param(new ZodValidationPipe(getUsersByIdScheme)) { id }: GetUserById,
    @Body(new ZodValidationPipe(updateUserScheme))
    { username, email, TypeUser, admin, status, schoolIds }: Updateuser,
    @Res() response: Response,) {
      let user = (await this.usersServices.findById(id)) as IUser;

      if (!user) {
        return response.status(404).json('User not found');
      }

      const promises = [];

      if (schoolIds) {
        
        if (schoolIds.length === 0) {
          user.schools = [];
        }


        for (let i=0; i < schoolIds.length; i++) {
          let schoolId = schoolIds[i];

          const findSchool = user.schools.find(x => x.id === schoolId);

          if (!findSchool) {
            promises.push(this.schoolsService.findById(schoolId));
          }
        }
      }

      if (promises.length > 0) {
        const schools = (await Promise.allSettled(promises).then((results) => {
          const allValue = (results.filter(x => x.status === 'fulfilled') as PromiseFulfilledResult<ISchool>[])
            .map(x => x.value);
          
          return allValue;
        })).filter(x => x);


        user.schools.push(...schools)
      }
      

      user.id = id;
      user.username = username;
      user.email = email;
      user.admin = admin;
      user.status = status;
      user.TypeUser = TypeUser;
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
