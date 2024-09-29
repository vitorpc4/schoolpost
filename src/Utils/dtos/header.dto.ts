import { ApiProperty } from '@nestjs/swagger';

export class headerDTO {
  @ApiProperty({
    name: 'schoolid',
  })
  schoolid: string;
}
