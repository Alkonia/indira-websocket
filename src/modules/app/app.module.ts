import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../../database/database.module';
import { PatientsModule } from '../patients/patients.module';
import { ChatsModule } from '../chats/chats.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { StepsModule } from '../steps/steps.module';
import { envConfig } from '../../config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [envConfig],
      isGlobal: true,
    }),
    DatabaseModule,
    PatientsModule,
    ChatsModule,
    StepsModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
