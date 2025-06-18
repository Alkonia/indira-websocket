import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Client extends Document {
  declare _id: string;

  @Prop({ trim: true })
  name: string;

  @Prop({ trim: true })
  identification: string;

  @Prop()
  dateOfBirth: Date;

  @Prop({ trim: true })
  identificationType: string;

  @Prop({ trim: true, required: true, index: true, unique: true })
  contactNumber: string;

  @Prop({ default: false })
  finishBasicData: boolean;

  @Prop({ default: false })
  acceptTerms: boolean;

  @Prop({ default: false })
  rejectAcceptTerms: boolean;

  @Prop()
  acceptTermsDate: Date;

  @Prop({ default: 1 })
  currentStep: number;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
export type IClient = Client;
