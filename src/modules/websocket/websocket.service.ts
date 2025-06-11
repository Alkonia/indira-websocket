import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  BaileysEventEmitter,
  ConnectionState,
} from 'baileys';
import P from 'pino';
import * as qrcode from 'qrcode-terminal';
import Boom from '@hapi/boom';
import { TWASocket, TMessageUpsert } from '../../interfaces/baileys.interface';
import { ChatsService } from '../chats/chats.service';
import { StepsService } from '../steps/steps.service';

@Injectable()
export class WebsocketService implements OnModuleInit, OnModuleDestroy {
  private socket?: TWASocket;
  private saveCreds?: () => Promise<void>;
  private eventSocket?: BaileysEventEmitter['on'];

  constructor(
    private readonly chatsService: ChatsService,
    private readonly stepsService: StepsService,
  ) {}

  async onModuleInit() {
    await this.initializeSocket();
    this.eventConnection();
    this.eventMessage();
    this.eventCreds();
    console.log('Conexión a Websocket establecida correctamente');
  }

  onModuleDestroy() {
    this.close();
  }

  private async initializeSocket() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const { version } = await fetchLatestBaileysVersion();

    this.socket = makeWASocket({
      version,
      logger: P({ level: 'silent' }),
      auth: state,
    });

    ChatsService.setSocket(this.socket);

    this.saveCreds = saveCreds;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.eventSocket = this.socket.ev.on;
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
            lastDisconnect?.error.output?.statusCode !==
              DisconnectReason.loggedOut;

          console.log('connection closed. Reconnecting?', shouldReconnect);
          if (shouldReconnect) {
            this.initializeSocket();
          }
        }

        if (connection === 'open') {
          console.log('✅ Conexión abierta');
        }
      },
    );
  }

  private eventMessage() {
    if (!this.eventSocket)
      throw new Error('Socket o saveCreds no inicializados');

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.eventSocket('messages.upsert', async (event: TMessageUpsert) => {
      if (!this.isExecutable(event)) {
        return;
      }
      console.log(JSON.stringify(event));
      try {
        await this.chatsService.saveResponse(event);
        await this.stepsService.processMessage(event);
      } catch (error) {
        console.log(error);
      }
    });
  }

  private eventCreds() {
    if (!this.eventSocket || !this.saveCreds)
      throw new Error('Socket o saveCreds no inicializados');

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.eventSocket('creds.update', this.saveCreds);
  }

  private isExecutable({ type, messages }: TMessageUpsert): boolean {
    const [message] = messages;
    return Boolean(
      type === 'notify' &&
        message.key.remoteJid &&
        //message.key.fromMe ||
        !message.key.remoteJid.includes('@g.us') &&
        !message.key.participant,
    );
  }

  close() {
    if (!this.socket) throw new Error('Socket o saveCreds no inicializados');
    this.socket.ev.removeAllListeners('connection.update');
    this.socket.ev.removeAllListeners('messages.upsert');
    this.socket.ev.removeAllListeners('creds.update');
    this.socket.end(undefined);
  }
}
