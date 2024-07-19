import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../category/category.entity';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { User, UserSchema } from '../user/user.entity';

@Schema({
  _id: true,
  timestamps: true,
})
export class Movies {
  @Prop({ required: true })
  namefirm: string;

  @Prop({})
  poster: string;

  @Prop({})
  description: string;

  @Prop({ type: [CategorySchema] })
  @Type(() => Array<Category>)
  categorys: Array<Category>;

  @Prop({})
  deleteAt: Date;

  @Prop({ type: UserSchema })
  @Type(() => User)
  deleteBy: User;
}

export const MoviesSchema = SchemaFactory.createForClass(Movies);
