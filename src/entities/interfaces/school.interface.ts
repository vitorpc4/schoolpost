import { IUserSchoolAssociation } from "./userSchoolAssociation.interface";

export interface ISchool {
  id?: string;
  name: string;
  createdAt?: Date;
  status: boolean;
  updatedAt?: Date;
  userSchoolAssociation?: IUserSchoolAssociation[];
}
