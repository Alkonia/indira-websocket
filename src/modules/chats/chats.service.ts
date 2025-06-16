import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from '../../models/chat.schema';
import { TMessageUpsert, TWASocket } from '../../interfaces/baileys.interface';
import { TMessageSend } from '../../interfaces/message-send.interface';
import { StepsService } from '../steps/steps.service';
import { sleep } from '../../utils/sleep.util';
import { extractText } from '../../utils/message.util';

@Injectable()
export class ChatsService {
  private waSocket: TWASocket;
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @Inject(forwardRef(() => StepsService))
    private stepsService: StepsService,
  ) {}

  setSocket(socket: TWASocket) {
    this.waSocket = socket;
  }

  async saveResponse(event: TMessageUpsert) {
    try {
      const [message] = event.messages;
      const text = extractText(message);

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
    if (!this.waSocket) {
      throw new Error('Socket no inicializado');
    }

    for (const message of messages) {
      await this.sendMessage(message);
      await this.saveMessage(message);
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
      return false;
    }

    const [message] = messages;

    if (!message || !message.key) {
      return false;
    }

    const result = Boolean(
      type === 'notify' &&
        message.key.remoteJid &&
        //message.key.fromMe ||
        !message.key.remoteJid.includes('@g.us') &&
        !message.key.participant &&
        message.key.remoteJid.startsWith('57'),
    );
    return result;
  }

  private async sendMessage(message: TMessageSend) {
    if (!this.waSocket) {
      throw new Error('Socket no inicializado');
    }
    try {
      await sleep(1000);
      await this.waSocket.sendMessage(message.remoteJid, {
        text: message.text,
      });
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  }

  private async saveMessage(message: TMessageSend) {
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
