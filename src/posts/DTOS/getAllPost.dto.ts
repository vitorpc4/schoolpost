import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class GetAllPostDTO {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  page: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  limit: number;
}
