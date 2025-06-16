import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  ConnectionState,
  BaileysEventEmitter,
} from 'baileys';
import * as P from 'pino';
import * as qrcode from 'qrcode-terminal';
import * as Boom from '@hapi/boom';
import { TWASocket } from '../../interfaces/baileys.interface';
import { ChatsService } from '../chats/chats.service';

@Injectable()
export class WebsocketService implements OnModuleInit, OnModuleDestroy {
  private socket?: TWASocket;
  private saveCreds?: () => Promise<void>;
  private eventSocket?: BaileysEventEmitter['on'];

  constructor(private readonly chatsService: ChatsService) {}

  async onModuleInit() {
    try {
      await this.initializeSocket();
      this.registerEvents();
      console.log('✅ WebSocket inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al iniciar WebSocket:', error);
    }
  }

  onModuleDestroy() {
    if (!this.socket) {
      console.warn('⚠️ Socket no inicializado al cerrar');
      return;
    }
    this.socket.ev.removeAllListeners('connection.update');
    this.socket.ev.removeAllListeners('messages.upsert');
    this.socket.ev.removeAllListeners('creds.update');
    this.socket.end(undefined);
    console.log('🧹 Socket cerrado correctamente');
  }

  private async initializeSocket() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const { version } = await fetchLatestBaileysVersion();

    this.socket = makeWASocket({
      version,
      logger: P.default({ level: 'silent' }),
      auth: state,
    });

    this.saveCreds = saveCreds;
    this.eventSocket = this.socket.ev.on;
    this.chatsService.setSocket(this.socket);
  }

  private registerEvents() {
    if (!this.eventSocket) throw new Error('Socket no inicializado');

    this.eventSocket('connection.update', this.connect.bind(this));

    this.eventSocket(
      'messages.upsert',
      this.chatsService.boundMessageHandler.bind(this.chatsService),
    );

    if (this.saveCreds) {
      this.eventSocket('creds.update', this.saveCreds);
    }
  }

  private connect({
    connection,
    lastDisconnect,
    qr,
  }: Partial<ConnectionState>) {
    console.log('📶 connection.update', { connection, lastDisconnect, qr });

    if (qr) {
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const shouldReconnect =
        Boom.isBoom(lastDisconnect?.error) &&
        lastDisconnect?.error.output?.statusCode !== DisconnectReason.loggedOut;

      console.log('🔌 Conexión cerrada. ¿Reconectar?', shouldReconnect);
      if (shouldReconnect) {
        this.onModuleInit();
      }
    }

    if (connection === 'open') {
      console.log('✅ Conexión abierta');
    }
  }
}
