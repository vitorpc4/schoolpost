import { IUser } from '@/entities/interfaces/user.interface';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IUserSchoolAssociation } from '../interfaces/userSchoolAssociation.interface';
import { userSchoolAssociation } from './userSchoolAssociation.entity';

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
  
  @OneToMany(() => userSchoolAssociation, (userSchoolAssociation) => userSchoolAssociation.user)
  userSchoolAssociation?: IUserSchoolAssociation[];
}
