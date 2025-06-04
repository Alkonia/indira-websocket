import http from 'http';
import { config } from '../config/env';
import { database } from '../database/database';
import WebSocketServer from './webSocketServer';
import ExpressApp from './expressApp';

class Server {
  public server: http.Server;
  public webSocket: WebSocketServer;
  public expressApp: ExpressApp;

  constructor() {
    this.expressApp = new ExpressApp();
    this.webSocket = new WebSocketServer();
    this.server = http.createServer(this.expressApp.app);
  }

  async start() {
    this.server.listen(config.server.port, async () => {
      try {
        await database.connect();
        await this.webSocket.main();
        console.log('Servidor listo y funcionando');
      } catch (error) {
        console.error('Error al iniciar servicios:', error);
      }
    });
  }

  async close() {
    console.log('Cerrando aplicación...');

    this.webSocket.close();
    this.server.close();
    await database.disconnect();

    process.exit(0);
  }
}

export default Server;
