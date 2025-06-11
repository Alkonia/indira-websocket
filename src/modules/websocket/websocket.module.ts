import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { ChatsModule } from '../chats/chats.module';
import { StepsModule } from '../steps/steps.module';

@Module({
  imports: [ChatsModule, StepsModule],
  providers: [WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
