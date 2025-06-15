import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { ChatsModule } from '../chats/chats.module';

@Module({
  imports: [ChatsModule],
  providers: [WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
