import { IPost } from './posts.interface';
import { IUser } from './user.interface';

export interface ISchool {
  id?: string;
  name: string;
  createdAt?: Date;
  status: boolean;
  updatedAt?: Date;
  users?: IUser[];
  posts?: IPost[];
}
