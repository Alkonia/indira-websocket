import { Injectable } from '@nestjs/common';
import { TEXTS } from '../../../constants/texts';
import { TMessageUpsert } from '../../../interfaces/baileys.interface';
import { StepBase } from '../step.base';

@Injectable()
export class NameStep extends StepBase {
  async main(event: TMessageUpsert): Promise<boolean> {
    const [message] = event.messages;
    if (!message.key?.remoteJid) {
      throw new Error('Se esperaba remoteJid');
    }
    await Promise.all([
      this.patientsService.upsertPatient({
        contactNumber: message.key.remoteJid,
        rejectAcceptTerms: false,
      }),
      this.chatsService.sendResponse([
        {
          remoteJid: message.key.remoteJid,
          text: TEXTS.greeting,
        },
        {
          remoteJid: message.key.remoteJid,
          text: TEXTS.firstMessage,
        },
      ]),
    ]);

    return true;
  }
}
