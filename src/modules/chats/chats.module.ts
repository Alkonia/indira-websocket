import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from '../../models/chat.schema';
import { ChatsService } from './chats.service';
import { StepsModule } from '../steps/steps.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    forwardRef(() => StepsModule),
  ],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
