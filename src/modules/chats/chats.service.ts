import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from '../../models/chat.schema';
import { TMessageUpsert, TWASocket } from '../../interfaces/baileys.interface';
import { TMessageSend } from '../../interfaces/message-send.interface';
import { StepsService } from '../steps/steps.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @Inject(forwardRef(() => StepsService))
    private stepsService: StepsService,
  ) {}

  private static waSocket: TWASocket;

  static setSocket(socket: TWASocket) {
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

  async boundMessageHandler(event: TMessageUpsert) {
    if (!this.isExecutable(event)) {
      return;
    }

    try {
      await Promise.all([
        this.saveResponse(event),
        this.stepsService.processMessage(event),
      ]);

      console.log('Mensaje procesado correctamente');
    } catch (error) {
      console.error('Error al procesar mensaje:', error);
    }
  }

  private isExecutable({ type, messages }: TMessageUpsert): boolean {
    if (!messages || messages.length === 0) {
      console.log('No hay mensajes en el evento');
      return false;
    }

    const [message] = messages;

    if (!message || !message.key) {
      console.log('Mensaje inválido o sin key');
      return false;
    }

    const result = Boolean(
      type === 'notify' &&
        message.key.remoteJid &&
        //message.key.fromMe ||
        !message.key.remoteJid.includes('@g.us') &&
        !message.key.participant,
    );
    return result;
  }
}
