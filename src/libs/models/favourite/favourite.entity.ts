import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user/user.entity';
import mongoose from 'mongoose';
import { Type } from 'class-transformer';
import { Movies } from '../movies/movies.entity';

@Schema({
  _id: true,
  timestamps: true,
})
export class Favourite {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId, // lien keets 1 - 1
    ref: 'users',
  })
  @Type(() => User)
  userId: User;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId, // lien keets 1 - 1
    ref: 'movies',
  })
  @Type(() => Movies)
  movieId: Movies;
}

export const FavouriteSchema = SchemaFactory.createForClass(Favourite);
