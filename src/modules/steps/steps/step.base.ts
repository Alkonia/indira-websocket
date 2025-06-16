import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { TMessageUpsert } from 'src/interfaces/baileys.interface';
import { IStepContract } from '../../../interfaces/steps-contract.interface';
import { ChatsService } from '../../chats/chats.service';
import { PatientsService } from '../../patients/patients.service';
import { extractText } from '../../../utils/message.util';

@Injectable()
export class StepBase implements IStepContract {
  constructor(
    protected readonly patientsService: PatientsService,
    @Inject(forwardRef(() => ChatsService))
    protected readonly chatsService: ChatsService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  main(_: TMessageUpsert): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  protected processMessage(event: TMessageUpsert) {
    const [message] = event.messages;
    const text = extractText(message) || '';

    if (!message.key?.remoteJid) {
      throw new Error('Se esperaba remoteJid');
    }

    const normalizedText = text.toLowerCase().replaceAll(' ', '');
    return {
      remoteJid: message.key.remoteJid,
      text: normalizedText,
    };
  }
}
