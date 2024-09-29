import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class GetSchoolById {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}
