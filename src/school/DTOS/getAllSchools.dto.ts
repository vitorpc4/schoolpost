import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsPositive, Max, Min } from 'class-validator';

export class GetAllSchools {
  @ApiProperty()
  @IsPositive()
  @Min(1)
  page: number;

  @ApiProperty()
  @IsPositive()
  @Max(100)
  limit: number;
}
