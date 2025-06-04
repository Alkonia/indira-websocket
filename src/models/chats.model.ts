import { Schema, model } from 'mongoose';

// Define the interface for the Patient document
export interface IChat {
  _id: string;
  text: string;
  contactNumber: string;
  fromMe: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Patient schema
const chatSchema = new Schema<IChat>(
  {
    text: {
      type: String,
      trim: true,
      required: true,
    },
    contactNumber: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    fromMe: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
    timestamps: true,
    versionKey: false,
  }
);

const Chat = model<IChat>('chats', chatSchema);
export default Chat;
