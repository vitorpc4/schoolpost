import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class GetUserByIdDTO {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  id: number;
}
