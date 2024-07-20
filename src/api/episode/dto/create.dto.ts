import { ApiProperty } from '@nestjs/swagger';

export class CreateEpisodeDto {
  @ApiProperty({})
  nameEpisodes: string;
  @ApiProperty({})
  episodesNum: number;
  @ApiProperty({})
  movie: string[];
}
