import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('config.server.port') || 3000;
  console.log(`Aplicación iniciada en el puerto ${port}`);
  await app.listen(port);
}

bootstrap().catch((err) => {
  console.error('Error al iniciar la aplicación:', err);
});
