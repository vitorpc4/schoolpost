import { ISchool } from './school.interface';
import { IUser } from './user.interface';

export interface IPost {
  id?: number;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDraft: boolean;
  status: boolean;
  user: IUser;
  school: ISchool;
}
