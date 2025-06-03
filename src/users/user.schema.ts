import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../common/enums/user-role.enum';

export type UserDocument = Users & Document;

@Schema({ timestamps: true })
export class Users {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, enum: Object.values(UserRole) })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(Users);
