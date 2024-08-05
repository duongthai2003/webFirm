import { InjectModel, ModelDefinition } from '@nestjs/mongoose';
import { UserSchema } from '../models/user/user.entity';
import { CategorySchema } from '../models/category/category.entity';
import { MoviesSchema } from '../models/movies/movies.entity';
import { EpisodesSchema } from '../models/episodes/episode.entity';
import { FavouriteSchema } from '../models/favourite/favourite.entity';

export enum MainDBModel {
  User = 'users',
  Category = 'category',
  Movies = 'movies',
  Episode = 'Episode',
  Favourite = 'favourite',
}

export const MainDBModels: ModelDefinition[] = [
  {
    name: MainDBModel.User,
    schema: UserSchema,
  },
  {
    name: MainDBModel.Category,
    schema: CategorySchema,
  },
  {
    name: MainDBModel.Movies,
    schema: MoviesSchema,
  },
  {
    name: MainDBModel.Episode,
    schema: EpisodesSchema,
  },
  {
    name: MainDBModel.Favourite,
    schema: FavouriteSchema,
  },
];
export const InjectMainDBModel = (model: MainDBModel) =>
  InjectModel(model, 'Web_Firm');
