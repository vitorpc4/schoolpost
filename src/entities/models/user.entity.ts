import { IUser } from '@/entities/interfaces/user.interface';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IPost } from '../interfaces/posts.interface';
import { Post } from './post.entity';
import { ISchool } from '../interfaces/school.interface';
import { School } from './school.entity';

export enum TypeUser {
  Professor = 'Professor',
  Editor = 'Editor',
  Student = 'Student',
}

@Entity({
  name: 'user',
})
export class User implements IUser {
  @PrimaryGeneratedColumn('increment', {
    name: 'id',
  })
  id?: number;

  @Column({
    name: 'username',
    type: 'varchar',
    length: 100,
  })
  username: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 125,
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    name: 'created_at',
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  @Column({
    name: 'status',
    type: 'boolean',
  })
  status: boolean;

  @Column({
    type: 'enum',
    enum: TypeUser,
    default: TypeUser.Professor,
  })
  TypeUser: TypeUser;

  @Column({
    name: 'admin',
    type: 'boolean',
    default: false,
  })
  admin: boolean;

  @ManyToMany(() => School, (school) => school.users)
  @JoinTable({
    name: 'user_school',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'school_id',
      referencedColumnName: 'id',
    },
  })
  schools?: ISchool[];
}
