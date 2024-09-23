import { ISchool } from './school.interface';
import { IUser } from './user.interface';
import { IUserSchoolAssociation } from './userSchoolAssociation.interface';

export interface IPost {
  id?: number;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDraft: boolean;
  status: boolean;
  userSchoolAssociation: IUserSchoolAssociation;
}
