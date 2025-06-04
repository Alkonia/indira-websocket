import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  BaileysEventEmitter,
  ConnectionState,
} from 'baileys';
import P from 'pino';
import qrcode from 'qrcode-terminal';
import Boom from '@hapi/boom';
import { TWASocket } from '../intefaces/baileys.interface';
import { MessageService } from '../services/message.service';

class WebSocketServer {
  static socket?: TWASocket;
  private saveCreds?: () => Promise<void>;
  private eventSocket?: BaileysEventEmitter['on'];
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  private async initializeSocket() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const { version } = await fetchLatestBaileysVersion();

    WebSocketServer.socket = makeWASocket({
      version,
      logger: P({ level: 'silent' }),
      auth: state,
    });
    this.saveCreds = saveCreds;
    this.eventSocket = WebSocketServer.socket.ev.on;
  }

  private eventConnection() {
    if (!this.eventSocket)
      throw new Error('Socket o saveCreds no inicializados');

    this.eventSocket(
      'connection.update',
      (update: Partial<ConnectionState>) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
          const shouldReconnect =
            Boom.isBoom(lastDisconnect?.error) &&
            lastDisconnect?.error.output?.statusCode !==
              DisconnectReason.loggedOut;

          console.log('connection closed. Reconnecting?', shouldReconnect);
          if (shouldReconnect) {
            this.main();
          }
        }

        if (connection === 'open') {
          console.log('✅ Conexión abierta');
        }
      }
    );
  }

  private eventMessage() {
    if (!this.eventSocket)
      throw new Error('Socket o saveCreds no inicializados');

    this.eventSocket(
      'messages.upsert',
      this.messageService.proccessMessage.bind(this.messageService)
    );
  }

  private eventCreds() {
    if (!this.eventSocket || !this.saveCreds)
      throw new Error('Socket o saveCreds no inicializados');

    this.eventSocket('creds.update', this.saveCreds);
  }

  async main() {
    await this.initializeSocket();

    this.eventConnection();
    this.eventMessage();
    this.eventCreds();
    console.log('Conexión a Websocket establecida correctamente');
  }

  async close() {
    if (!WebSocketServer.socket)
      throw new Error('Socket o saveCreds no inicializados');
    WebSocketServer.socket.ev.removeAllListeners('connection.update');
    WebSocketServer.socket.ev.removeAllListeners('messages.upsert');
    WebSocketServer.socket.ev.removeAllListeners('creds.update');
    WebSocketServer.socket.end(undefined);
  }
}

export default WebSocketServer;
