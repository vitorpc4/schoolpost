import { ISchool } from '@/entities/interfaces/school.interface';
import { SchoolsService } from '@/services/school.service';
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
import { Request, Response } from 'express';
import { AuthGuard } from '@/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CreateSchoolDTO } from '../DTOS/createSchool.dto';
import { UpdateSchoolDTO } from '../DTOS/updateSchool.dto';
import { GetAllSchools } from '../DTOS/getAllSchools.dto';
import { GetSchoolById } from '../DTOS/getSchoolById.dto';
import { UserSchoolAssociationService } from '@/services/userSchoolAssociation.service';
import { IUserSchoolAssociation } from '@/entities/interfaces/userSchoolAssociation.interface';
import { UsersService } from '@/services/user.service';
import { TypeUser } from '@/entities/models/userSchoolAssociation.entity';
import { env } from '@/env';
import { GlobalTokenService } from '@/shared/globalTokenService';
import { DecodedPayloadDTO } from '@/Utils/dtos/decodedPayload.dto';
@ApiTags('School')
@UseGuards(AuthGuard)
@Controller('school')
export class SchoolController {
  constructor(
    private schoolsService: SchoolsService,
    private userSchoolAssociationService: UserSchoolAssociationService,
    private usersService: UsersService,
    private readonly globalTokenService: GlobalTokenService,
  ) {}

  @Get()
  async getAllSchool(@Query() { page, limit }: GetAllSchools) {
    return await this.schoolsService.findAll(page, limit);
  }

  @Get(':id')
  async getSchoolById(
    @Param() { id }: GetSchoolById,
    @Res() response: Response,
  ) {
    const decoded =
      this.globalTokenService.getDecodedToken() as DecodedPayloadDTO;

    const schools = decoded.schools.filter((x) => x.schoolId == id);

    if (schools.length == 0) {
      return response.status(403).json({
        message:
          'Fail check your auth, you cant access informatio from another school',
      });
    }

    const result = await this.schoolsService.findById(id);

    return response.status(200).send(result);
  }

  @Post()
  async createSchool(
    @Body() { name, status }: CreateSchoolDTO,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const decoded = this.globalTokenService.getDecodedToken();

    const jwt = require('jsonwebtoken');

    const createsSchool = await this.schoolsService.create({
      name,
      status,
    });

    const user = await this.usersService.findById(+decoded.sub);

    const association: IUserSchoolAssociation = {
      user: user,
      school: createsSchool,
      status: true,
      typeUser: TypeUser.Professor,
      admin: true,
    };

    await this.userSchoolAssociationService.create(association);

    const schoolInfo = {
      schoolId: createsSchool.id,
      typeUser: TypeUser.Professor,
      admin: true,
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

    return response
      .status(201)
      .json({ schoolId: schoolInfo.schoolId, token: newAuthToken });
  }

  @Put(':id')
  async updateSchool(
    @Param() { id }: GetSchoolById,
    @Body() { name, status }: UpdateSchoolDTO,
    @Res() response: Response,
  ) {
    const decoded =
      this.globalTokenService.getDecodedToken() as DecodedPayloadDTO;

    const schools = decoded.schools.filter((x) => x.schoolId == id);

    if (schools.length == 0) {
      return response
        .status(403)
        .json({ message: 'Fail update not authorized' });
    }

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
  async deleteSchool(@Param('id') id: string, @Res() response: Response) {
    const decoded =
      this.globalTokenService.getDecodedToken() as DecodedPayloadDTO;

    const schools = decoded.schools.filter((x) => x.schoolId == id);

    if (schools.length == 0) {
      return response
        .status(403)
        .json({ message: 'Fail delete not authorized' });
    }

    await this.schoolsService.delete(id);

    return response.status(204).send();
  }
}
