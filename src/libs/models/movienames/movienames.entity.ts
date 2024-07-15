import { Schema } from '@nestjs/mongoose';

@Schema({
  _id: true,
  timestamps: true,
})
export class movieNames {}
