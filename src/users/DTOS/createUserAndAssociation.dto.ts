import { TypeUser } from '@/entities/models/userSchoolAssociation.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class createUserAndAssociationDTO {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsBoolean()
  status: boolean;

  @ApiProperty()
  @IsNotEmpty()
  typeUser: TypeUser;

  @ApiProperty()
  @IsNotEmpty()
  schoolId: string;

  @ApiProperty()
  @IsBoolean()
  admin: boolean;
}
