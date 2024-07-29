import { ApiProperty } from '@nestjs/swagger';
import { File } from 'buffer';

export class CreateMoviesDto {
  @ApiProperty({})
  namefirm: string;
  @ApiProperty({})
  description: string;

  @ApiProperty({})
  categorys: string[];

  @ApiProperty({})
  Showtimes: number;
}
