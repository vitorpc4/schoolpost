import { TypeUser } from '@/entities/models/userSchoolAssociation.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateDTO {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  schoolId: string;

  @ApiProperty()
  @IsBoolean()
  status: boolean;

  @ApiProperty()
  typeUser: TypeUser;

  @ApiProperty()
  @IsBoolean()
  admin: boolean;
}
