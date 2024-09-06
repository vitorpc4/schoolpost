import { ISchool } from './school.interface';

export interface IPost {
  id?: number;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDraft: boolean;
  status: boolean;
  school: ISchool;
}
