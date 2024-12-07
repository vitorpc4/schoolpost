import { IUserSchoolAssociation } from '@/entities/interfaces/userSchoolAssociation.interface';
import { TypeUser } from '@/entities/models/userSchoolAssociation.entity';

export interface IUserResponseDto {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
  schoolId: string;
  name: string;
  userSchoolAssociationId: number;
  typeUser: TypeUser;
  admin: boolean;
}
