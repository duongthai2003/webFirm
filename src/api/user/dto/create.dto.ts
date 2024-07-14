import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    required: true,
  })
  email: string;
  @ApiProperty({ required: true })
  password: string;
  @ApiProperty({ required: true })
  username: string;
  @ApiProperty({ required: true })
  firstName: string;
  @ApiProperty({ required: true })
  lastName: string;
}
