import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class PaginationDTO {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  limit: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  page: number;
}
