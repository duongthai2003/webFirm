import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({})
  username: string;
  @ApiProperty({})
  firstName: string;
  @ApiProperty({})
  lastName: string;
}
