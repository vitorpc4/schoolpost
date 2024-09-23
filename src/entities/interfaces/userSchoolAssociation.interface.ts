import { TypeUser } from "../models/userSchoolAssociation.entity";
import { IPost } from "./posts.interface";
import { ISchool } from "./school.interface";
import { IUser } from "./user.interface";

export interface IUserSchoolAssociation {
    id?: number;
    user: IUser;
    school: ISchool;
    post?: IPost[];
    status: boolean;
    typeUser: TypeUser;
    admin: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}