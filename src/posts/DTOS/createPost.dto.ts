import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreatePostDTO {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsBoolean()
  isDraft: boolean;

  @ApiProperty()
  @IsBoolean()
  status: boolean;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  associationSchool: number;
}
