import { ISchool } from '@/entities/interfaces/school.interface';
import { School } from '@/entities/models/school.entity';
import { Injectable } from '@nestjs/common';
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
    return await this.schoolRepository.findOneBy({ id });
  }

  async create(school: ISchool): Promise<ISchool> {
    return await this.schoolRepository.save(school);
  }

  async update(school: ISchool): Promise<ISchool> {
    return await this.schoolRepository.save(school);
  }

  async delete(id: number): Promise<void> {
    await this.schoolRepository.delete(id);
  }
}
