// src/users/schemas/user.schema.ts
import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../common/enums/role.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: Role, required: true })
  role: Role;

  @Prop({ default: false })
  status: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Center', default: null })
center?: string | null;


}

export const UserSchema = SchemaFactory.createForClass(User);
