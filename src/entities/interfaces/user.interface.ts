import { IUserSchoolAssociation } from "./userSchoolAssociation.interface";

export interface IUser {
  id?: number;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  status: boolean;
  updatedAt?: Date;
  userSchoolAssociation?: IUserSchoolAssociation[];
}
