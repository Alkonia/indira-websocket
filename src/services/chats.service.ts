import { TMessageSend } from '../intefaces/message.interface';
import { ChatRepository } from '../repositories/chat.repository';
import WebSocketServer from '../servers/webSocketServer';
import { TMessageUpsert } from '../intefaces/baileys.interface';

export class ChatsService {
  private static chatRepository: ChatRepository = new ChatRepository();

  static async saveResponse(event: TMessageUpsert) {
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
      await ChatsService.chatRepository.create({
        contactNumber: message.key.remoteJid,
        text,
        fromMe: false,
      });
    } catch (error) {
      console.error('Error al guardar mensaje:', error);
    }
  }

  static async sendResponse(messages: TMessageSend[]) {
    if (!WebSocketServer.socket) {
      throw new Error('Socket no inicializado');
    }
    // await delay(5000);
    for (const message of messages) {
      try {
        await WebSocketServer.socket?.sendMessage(message.remoteJid, {
          text: message.text,
        });
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
      }
      try {
        await ChatsService.chatRepository.create({
          contactNumber: message.remoteJid,
          text: message.text,
          fromMe: true,
        });
      } catch (error) {
        console.error('Error al guardar mensaje:', error);
      }
    }
  }
}
