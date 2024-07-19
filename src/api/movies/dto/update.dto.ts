import { ApiProperty } from '@nestjs/swagger';

export class UpdateMoviesDto {
  @ApiProperty({})
  namefirm: string;
  @ApiProperty({})
  poster: string;
  @ApiProperty({})
  description: string;
  @ApiProperty({
    example: [],
  })
  categorys: string[];
}
