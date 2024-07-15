import { InjectModel, ModelDefinition } from '@nestjs/mongoose';
import { UserSchema } from '../models/user/user.entity';
import { CategorySchema } from '../models/category/category.entity';

export enum MainDBModel {
  User = 'users',
  Category = 'category',
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
];
export const InjectMainDBModel = (model: MainDBModel) =>
  InjectModel(model, 'Web_Firm');
