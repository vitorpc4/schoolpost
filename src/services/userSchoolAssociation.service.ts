import { IUser } from '@/entities/interfaces/user.interface';
import { IUserSchoolAssociation } from '@/entities/interfaces/userSchoolAssociation.interface';
import {
  TypeUser,
  userSchoolAssociation,
} from '@/entities/models/userSchoolAssociation.entity';
import { GetAllUserResponse } from '@/posts/DTOS/Response/GetAllUserResponse';
import { IUserResponseDto } from '@/posts/DTOS/Response/IUserResponseDTO';
import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserSchoolAssociationService {
  constructor(
    @InjectRepository(userSchoolAssociation)
    private userSchoolAssociationRepository: Repository<userSchoolAssociation>,
  ) {}

  async findAllByUserIdAndSchool(
    userId: number,
    schoolIds: string[],
  ): Promise<IUserSchoolAssociation[]> {
    const query = await this.userSchoolAssociationRepository
      .createQueryBuilder('user_school_association')
      .where('user_school_association.userId = :userId', { userId })
      .andWhere('user_school_association.status = true')
      .leftJoinAndSelect('user_school_association.school', 'school')
      .getMany();

    if (!query) {
      throw new NotFoundException('User not found');
    }

    return query;
  }

  async findAllByUserId(userId: number): Promise<IUserSchoolAssociation[]> {
    const query = await this.userSchoolAssociationRepository
      .createQueryBuilder('user_school_association')
      .where('user_school_association.userId = :userId', { userId })
      .andWhere('user_school_association.status = true')
      .leftJoinAndSelect('user_school_association.school', 'school')
      .getMany();

    if (!query) {
      throw new NotFoundException('User not found');
    }

    return query;
  }

  async findAllBySchoolId(schoolId: string): Promise<IUserSchoolAssociation[]> {
    const query = await this.userSchoolAssociationRepository
      .createQueryBuilder('userSchoolAssociation')
      .where('userSchoolAssociation.schoolId = :schoolId', { schoolId })
      .andWhere('userSchoolAssociation.status = true')
      .getMany();

    return query;
  }

  async getAllUserBySchoolId(
    schoolId: string,
    page: number,
    limit: number,
  ): Promise<GetAllUserResponse> {
    const skip = (page - 1) * limit;
    const take = limit;

    const countTotalItems = await this.userSchoolAssociationRepository
      .createQueryBuilder('userSchoolAssociation')
      .where('userSchoolAssociation.schoolId = :schoolId', { schoolId })
      .andWhere('userSchoolAssociation.status = true')
      .getCount();

    const totalPages = Math.ceil(countTotalItems / limit);

    const query = await this.userSchoolAssociationRepository
      .createQueryBuilder('usa')
      .select([
        'usa.id',
        'u.id',
        'u.username',
        'u.email',
        'u.createdAt',
        'u.updatedAt',
        'u.status',
        'usa.typeUser',
        'usa.admin',
        'usa.status',
        's.id',
        's.name',
      ])
      .where('usa.schoolId = :schoolId', { schoolId })
      .andWhere('usa.status = true')
      .innerJoin('usa.user', 'u')
      .innerJoin('usa.school', 's')
      .take(take)
      .skip(skip)
      .getMany();

    const users: IUserResponseDto[] = query.map((x) => {
      return {
        id: x.user.id,
        username: x.user.username,
        email: x.user.email,
        createdAt: x.user.createdAt,
        status: x.user.status,
        updatedAt: x.user.updatedAt,
        schoolId: x.school.id,
        name: x.school.name,
        userSchoolAssociationId: x.id,
        typeUser: x.typeUser,
        admin: x.admin,
      };
    });

    const result: GetAllUserResponse = {
      totalItems: countTotalItems,
      totalPages: totalPages,
      users: users,
    };

    return result;
  }

  async findAllBySchoolIdAndTypeUser(
    schoolId: string,
    typeUser: TypeUser,
  ): Promise<IUserSchoolAssociation[]> {
    const query = await this.userSchoolAssociationRepository
      .createQueryBuilder('userSchoolAssociation')
      .where('userSchoolAssociation.schoolId = :schoolId', { schoolId })
      .andWhere('userSchoolAssociation.status = true')
      .andWhere('userSchoolAssociation.typeUser = :typeUser', { typeUser })
      .getMany();

    return query;
  }

  async findById(id: number): Promise<IUserSchoolAssociation> {
    const result = await this.userSchoolAssociationRepository
      .find({
        relations: {
          school: true,
        },
        where: {
          id: id,
          status: true,
        },
      })
      .then((res) => {
        return res;
      });

    return result[0];
  }

  async create(
    userSchoolAssociation: IUserSchoolAssociation,
  ): Promise<IUserSchoolAssociation> {
    return await this.userSchoolAssociationRepository.save(
      userSchoolAssociation,
    );
  }

  async update(
    userSchoolAssociation: IUserSchoolAssociation,
  ): Promise<IUserSchoolAssociation> {
    return await this.userSchoolAssociationRepository.save(
      userSchoolAssociation,
    );
  }

  async delete(association: IUserSchoolAssociation): Promise<void> {
    await this.userSchoolAssociationRepository.save(association);
  }
}
