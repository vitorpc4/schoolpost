import { TypeUser } from '@/entities/models/userSchoolAssociation.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateInviteDto {
  @ApiProperty()
  @IsNotEmpty()
  school: string;

  @ApiProperty()
  typeUser: TypeUser;

  @ApiProperty()
  @IsBoolean()
  admin: boolean;
}
