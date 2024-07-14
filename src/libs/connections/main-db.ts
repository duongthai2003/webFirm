import { InjectModel, ModelDefinition } from '@nestjs/mongoose';
import { UserSchema } from '../models/user/user.entity';

export enum MainDBModel {
  User = 'users',
}

export const MainDBModels: ModelDefinition[] = [
  {
    name: MainDBModel.User,
    schema: UserSchema,
  },
];
export const InjectMainDBModel = (model: MainDBModel) =>
  InjectModel(model, 'Web_Firm');
