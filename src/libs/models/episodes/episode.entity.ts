import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';

import { Movies, MoviesSchema } from '../movies/movies.entity';

@Schema({
  _id: true,
  timestamps: true,
})
export class Episodes {
  @Prop({ required: true })
  nameEpisodes: string;

  @Prop({ required: true })
  episodesNum: number;

  @Prop({ required: true })
  nameFile: string;

  @Prop({ type: MoviesSchema })
  @Type(() => Movies)
  movie: Movies;
}

export const EpisodesSchema = SchemaFactory.createForClass(Episodes);
