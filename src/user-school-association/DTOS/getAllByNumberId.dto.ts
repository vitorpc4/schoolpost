import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class GetAllByNumberIdDTO {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  id: number;
}
