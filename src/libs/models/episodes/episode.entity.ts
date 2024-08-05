import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';

import { Movies, MoviesSchema } from '../movies/movies.entity';
import mongoose from 'mongoose';

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

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movies' }],
    // lien ket nhieu
    // cai tên ref kia là tù bên MainDBModel
  })
  @Type(() => Array<Movies>)
  movieId: Array<Movies>;

  // @Prop({ type: MoviesSchema })
  // @Type(() => Movies)
  // movie: Movies;
}

export const EpisodesSchema = SchemaFactory.createForClass(Episodes);
