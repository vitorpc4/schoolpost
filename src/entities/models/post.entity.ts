import { IPost } from '@/entities/interfaces/posts.interface';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IUserSchoolAssociation } from '../interfaces/userSchoolAssociation.interface';
import { userSchoolAssociation } from './userSchoolAssociation.entity';

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

  @Index("is_draft")
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

  @ManyToOne(() => userSchoolAssociation, (userSchoolAssociation) => userSchoolAssociation.post)
  userSchoolAssociation: IUserSchoolAssociation;
}
