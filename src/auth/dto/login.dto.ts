import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'thaiq9577@gmail.com',
  })
  email: '' | string;
  @ApiProperty({
    example: '12345678',
  })
  password: '' | string;
  @ApiProperty()
  rememberLogin: false | boolean;
}
