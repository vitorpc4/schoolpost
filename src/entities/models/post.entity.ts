import { IPost } from '@/entities/interfaces/posts.interface';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { IUser } from '../interfaces/user.interface';
import { ISchool } from '../interfaces/school.interface';
import { School } from './school.entity';

@Entity({
  name: 'post',
})
export class Post implements IPost {
  @PrimaryGeneratedColumn('increment', {
    name: 'id',
  })
  id?: number;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 255,
  })
  title: string;

  @Column({
    name: 'content',
    type: 'text',
  })
  content: string;

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
    name: 'is_draft',
    type: 'boolean',
  })
  isDraft: boolean;

  @Column({
    name: 'status',
    type: 'boolean',
  })
  status: boolean;

  @ManyToOne(() => School, (school) => school.posts)
  school: ISchool;
}
