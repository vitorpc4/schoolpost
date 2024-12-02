import { IUserSchoolAssociation } from '@/entities/interfaces/userSchoolAssociation.interface';

export interface IUserResponseDto {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
  userSchoolAssociation: IUserSchoolAssociation;
}
