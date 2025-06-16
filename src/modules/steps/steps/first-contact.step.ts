import { Injectable } from '@nestjs/common';
import { TEXTS } from '../../../constants/texts';
import { TMessageUpsert } from '../../../interfaces/baileys.interface';
import { StepBase } from './step.base';

@Injectable()
export class FirstContactStep extends StepBase {
  async main(event: TMessageUpsert): Promise<boolean> {
    const { remoteJid } = this.processMessage(event);
    await Promise.all([
      this.clientsService.upsertClient({
        contactNumber: remoteJid,
        rejectAcceptTerms: false,
      }),
      this.chatsService.sendResponse([
        {
          remoteJid,
          text: TEXTS.greeting,
        },
        {
          remoteJid,
          text: TEXTS.firstMessage,
        },
      ]),
    ]);

    return true;
  }
}
