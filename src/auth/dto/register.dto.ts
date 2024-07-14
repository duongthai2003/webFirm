import { IsEmail } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'thaiq9577@gmail.com',
  })
  @IsEmail() // check email format
  email: string;

  @ApiProperty({
    example: 'DuongThai',
  })
  username: '' | string;

  @ApiProperty({
    example: '12345678',
  })
  password: '' | string;

  @ApiProperty({
    example: 'Duong',
  })
  firstName: '' | string;
  @ApiProperty({
    example: 'Thai',
  })
  lastName: '' | string;
}
