import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class GetPostByIdDTO {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  id: number;
}
