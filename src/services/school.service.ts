import { ISchool } from '@/entities/interfaces/school.interface';
import { School } from '@/entities/models/school.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
  ) {}

  async findAll(page: number, limit: number): Promise<ISchool[]> {
    return await this.schoolRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findById(id: string): Promise<ISchool> {
    const school = await this.schoolRepository.findOneBy({ id });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    return school;
  }

  async create(school: ISchool): Promise<ISchool> {
    return await this.schoolRepository.save(school);
  }

  async update(school: ISchool): Promise<ISchool> {
    return await this.schoolRepository.save(school);
  }

  async delete(id: string): Promise<void> {
    await this.schoolRepository.delete(id);
  }
}
