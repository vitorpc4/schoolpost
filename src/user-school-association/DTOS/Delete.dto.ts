import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class DeleteDTO {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  id: number;
}
