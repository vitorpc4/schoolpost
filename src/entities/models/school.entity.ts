import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ISchool } from '../interfaces/school.interface';
import { IUser } from '../interfaces/user.interface';
import { Post } from './post.entity';
import { IPost } from '../interfaces/posts.interface';
import { User } from './user.entity';
import { IUserSchoolAssociation } from '../interfaces/userSchoolAssociation.interface';
import { userSchoolAssociation } from './userSchoolAssociation.entity';

@Entity({
  name: 'school',
})
export class School implements ISchool {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name: string;
  @Column({
    name: 'created_at',
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;
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
  updatedAt?: Date;

  @OneToMany(() => userSchoolAssociation, (userSchoolAssociation) => userSchoolAssociation.user)
  userSchoolAssociation?: IUserSchoolAssociation[];
}
