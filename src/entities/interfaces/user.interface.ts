import { TypeUser } from '../models/user.entity';
import { ISchool } from './school.interface';

export interface IUser {
  id?: number;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  status: boolean;
  updatedAt?: Date;
  TypeUser: TypeUser;
  admin: boolean;
  schools?: ISchool[];
}
