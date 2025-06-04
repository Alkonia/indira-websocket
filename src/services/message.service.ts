import { TMessageUpsert } from '../intefaces/baileys.interface';
import { StepsService } from './steps.service';
import { ChatsService } from './chats.service';

export class MessageService {
  private readonly stepsService: StepsService;

  constructor() {
    this.stepsService = new StepsService();
  }

  private isExecutable({ type, messages }: TMessageUpsert): boolean {
    const [message] = messages;
    return Boolean(
      type === 'notify' &&
        message.key.remoteJid &&
        //message.key.fromMe ||
        !message.key.remoteJid.includes('@g.us') &&
        !message.key.participant
    );
  }

  async proccessMessage(event: TMessageUpsert) {
    if (!this.isExecutable(event)) {
      return;
    }
    console.log(JSON.stringify(event));
    try {
      await ChatsService.saveResponse(event);
      await this.stepsService.main(event);
    } catch (error) {
      console.log(error);
    }
  }
}
