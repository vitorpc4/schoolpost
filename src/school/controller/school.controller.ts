import { ISchool } from '@/entities/interfaces/school.interface';
import { SchoolsService } from '@/services/school.service';
import { ZodValidationPipe } from '@/pipe/zod-validation.pipe';
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
import { query, Response } from 'express';
import { z } from 'zod';
import { AuthGuard } from '@/auth/auth.guard';

const createSchoolScheme = z.object({
  name: z.string(),
  status: z.boolean(),
});

const updateSchoolScheme = z.object({
  name: z.string(),
  status: z.boolean(),
});

const getSchoolByIdScheme = z.object({
  id: z.coerce.string(),
});

const getAllSchols = z.object({
  limit: z.coerce.number().default(10),
  page: z.coerce.number().default(1),
});

type CreateSchool = z.infer<typeof createSchoolScheme>;
type GetSchoolById = z.infer<typeof getSchoolByIdScheme>;
type UpdateSchool = z.infer<typeof updateSchoolScheme>;
type GetAllSchools = z.infer<typeof getAllSchols>;

@UseGuards(AuthGuard)
@Controller('school')
export class SchoolController {
  constructor(private schoolsService: SchoolsService) {}

  @Get()
  async getAllSchool(
    @Query(new ZodValidationPipe(getAllSchols)) { page, limit }: GetAllSchools,
  ) {
    return await this.schoolsService.findAll(page, limit);
  }

  @Get(':id')
  async getSchoolById(
    @Param(new ZodValidationPipe(getSchoolByIdScheme)) { id }: GetSchoolById,
  ) {
    return await this.schoolsService.findById(id);
  }

  @Post()
  async createSchool(
    @Body(new ZodValidationPipe(createSchoolScheme))
    { name, status }: CreateSchool,
  ) {
    return this.schoolsService.create({
      name,
      status,
    });
  }

  @Put(':id')
  async updateSchool(
    @Param(new ZodValidationPipe(getSchoolByIdScheme)) { id }: GetSchoolById,
    @Body(new ZodValidationPipe(updateSchoolScheme))
    { name, status }: UpdateSchool,
    @Res() response: Response,
  ) {
    let school = (await this.schoolsService.findById(id)) as ISchool;
    if (!school) {
      return response.status(404).send();
    }

    school.id = id;
    school.name = name;
    school.status = status;

    const result = await this.schoolsService.update(school);

    return response.status(200).send(result);
  }

  @Delete(':id')
  async deleteSchool(@Param('id') id: number, @Res() response: Response) {
    await this.schoolsService.delete(id);

    return response.status(204).send();
  }
}
