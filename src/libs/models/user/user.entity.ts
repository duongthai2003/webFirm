import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Schema({
  timestamps: true,
  _id: true,
  toObject: {
    virtuals: true, // truong ao
  },
})
export class User extends Model {
  @Prop({})
  email: string;
  @Prop({})
  username: string;
  @Prop({})
  firstName: string;
  @Prop({})
  lastName: string;
  fullName: string;

  @Prop({})
  passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.virtual('displayName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
