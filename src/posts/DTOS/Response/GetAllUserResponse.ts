import { IUser } from '@/entities/interfaces/user.interface';
import { IUserResponseDto } from './IUserResponseDTO';

export interface GetAllUserResponse {
  totalItems: number;
  totalPages: number;
  users: IUserResponseDto[];
}
