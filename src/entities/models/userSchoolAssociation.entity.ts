import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IUserSchoolAssociation } from "../interfaces/userSchoolAssociation.interface";
import { IUser } from "../interfaces/user.interface";
import { User } from "./user.entity";
import { ISchool } from "../interfaces/school.interface";
import { School } from "./school.entity";
import { IPost } from "../interfaces/posts.interface";
import { Post } from "./post.entity";

export enum TypeUser {
    Professor = 'Professor',
    Editor = 'Editor',
    Student = 'Student',
}

@Entity({
    name: 'user_school_association',
})

export class userSchoolAssociation implements IUserSchoolAssociation {
    @PrimaryGeneratedColumn('increment', {
        name: 'id',
      })
    id?: number;
    
    @Column({
        name: 'status',
        type: 'boolean',
    })
    status: boolean;
    @Column({
        name: 'updated_at',
        type: 'timestamp without time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt?: Date;
    @Column({
        name: 'createdAt',
        type: 'timestamp without time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt?: Date;
    @Column({
        type: 'enum',
        enum: TypeUser,
        default: TypeUser.Professor,
    })
    typeUser: TypeUser;
    @Column({
        name: 'admin',
        type: 'boolean',
    })
    admin: boolean;

    @ManyToOne(() => User, (user) => user.userSchoolAssociation)
    user: IUser;
    
    @ManyToOne(() => School, (school) => school.userSchoolAssociation)
    school: ISchool;

    @OneToMany(() => Post, (Post) => Post.userSchoolAssociation)
    post?: IPost[];
}