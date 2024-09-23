import { IUserSchoolAssociation } from "@/entities/interfaces/userSchoolAssociation.interface";
import { TypeUser, userSchoolAssociation } from "@/entities/models/userSchoolAssociation.entity";
import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserSchoolAssociationService {
    constructor(
        @InjectRepository(userSchoolAssociation)
        private userSchoolAssociationRepository: Repository<userSchoolAssociation>,
    ) {}

    async findAllByUserId(userId: number): Promise<IUserSchoolAssociation[]> {
        const query = await this.userSchoolAssociationRepository.createQueryBuilder('user_school_association')
            .where('user_school_association.userId = :userId', { userId })
            .andWhere('user_school_association.status = true')
            .leftJoinAndSelect('user_school_association.school', 'school')
            .getMany();

        return query;
    }

    async findAllBySchoolId(schoolId: string): Promise<IUserSchoolAssociation[]> {
        const query = await this.userSchoolAssociationRepository.createQueryBuilder('userSchoolAssociation')
            .where('userSchoolAssociation.schoolId = :schoolId', { schoolId })
            .andWhere('userSchoolAssociation.status = true')
            .getMany();
        
        return query;
    }


    async findAllBySchoolIdAndTypeUser(schoolId: string, typeUser: TypeUser): Promise<IUserSchoolAssociation[]> {
        const query = await this.userSchoolAssociationRepository.createQueryBuilder('userSchoolAssociation')
            .where('userSchoolAssociation.schoolId = :schoolId', { schoolId })
            .andWhere('userSchoolAssociation.status = true')
            .andWhere('userSchoolAssociation.typeUser = :typeUser', { typeUser })
            .getMany();
        
        return query;
    }



    async findById(id: number): Promise<IUserSchoolAssociation> {
        return await this.userSchoolAssociationRepository.findOneBy({ id: id, status:true });
    }

    async create(userSchoolAssociation: IUserSchoolAssociation): Promise<IUserSchoolAssociation> {
        return await this.userSchoolAssociationRepository.save(userSchoolAssociation);
    }

    async update(userSchoolAssociation: IUserSchoolAssociation): Promise<IUserSchoolAssociation> {
        return await this.userSchoolAssociationRepository.save(userSchoolAssociation);
    }

    async delete (id: number): Promise<void> {
        await this.userSchoolAssociationRepository.delete(id);
    }
}