import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from '../../models/chat.schema';
import { TMessageUpsert } from '../../interfaces/baileys.interface';
import { TMessageSend } from '../../interfaces/message-send.interface';

@Injectable()
export class ChatsService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  private static waSocket: any;

  static setSocket(socket: any) {
    ChatsService.waSocket = socket;
  }

  async saveResponse(event: TMessageUpsert) {
    try {
      const [message] = event.messages;
      const text =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        message.message?.stickerMessage?.url;

      if (!message.key.remoteJid || !text) {
        console.log(message);
        throw new Error('Se esperaba remoteJid');
      }

      const newChat = new this.chatModel({
        contactNumber: message.key.remoteJid,
        text,
        fromMe: false,
      });

      await newChat.save();
    } catch (error) {
      console.error('Error al guardar mensaje:', error);
    }
  }

  async sendResponse(messages: TMessageSend[]) {
    if (!ChatsService.waSocket) {
      throw new Error('Socket no inicializado');
    }

    for (const message of messages) {
      try {
        await ChatsService.waSocket.sendMessage(message.remoteJid, {
          text: message.text,
        });
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
      }

      try {
        const newChat = new this.chatModel({
          contactNumber: message.remoteJid,
          text: message.text,
          fromMe: true,
        });

        await newChat.save();
      } catch (error) {
        console.error('Error al guardar mensaje:', error);
      }
    }
  }
}
