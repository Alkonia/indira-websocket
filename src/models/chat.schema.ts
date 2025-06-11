import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Chat extends Document {
  @Prop({ trim: true, required: true })
  text: string;

  @Prop({ trim: true, required: true, index: true })
  contactNumber: string;

  @Prop({ default: false })
  fromMe: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
export type IChat = Chat;
