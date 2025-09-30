import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User extends Document {
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, default: null })
  phone: string | null;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true, enum: ['admin', 'user'] })
  role: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ default: null })
  lastLogin: Date;

  @Prop({ type: Boolean, default: true })
  is2FAEnabled: boolean;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
