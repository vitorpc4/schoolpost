import { IPost } from '@/entities/interfaces/posts.interface';

export interface GetAllPostResponse {
  totalItems: number;
  totalPages: number;
  posts: IPost[];
}
