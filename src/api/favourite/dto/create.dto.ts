import { ApiProperty } from '@nestjs/swagger';

export class CreateFavouriteDto {
  @ApiProperty({})
  movieId: string;
}
