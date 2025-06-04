import Server from './servers/server';

const instanceServer = new Server();

instanceServer.start();

process.on('SIGINT', async () => {
  instanceServer.close();
});
