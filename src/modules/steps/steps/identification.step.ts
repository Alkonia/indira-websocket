import { Injectable } from '@nestjs/common';
import { TEXTS } from '../../../constants/texts';
import { TMessageUpsert } from '../../../interfaces/baileys.interface';
import { StepBase } from './step.base';
import { extractText } from '../../../utils/message.util';

@Injectable()
export class IdentificationStep extends StepBase {
  async main(event: TMessageUpsert): Promise<boolean> {
    const { remoteJid } = this.processMessage(event);
    const [message] = event.messages;
    const identification = extractText(message) || '';

    if (!identification.trim()) {
      await this.chatsService.sendResponse([
        {
          remoteJid,
          text: TEXTS.invalidIdentification,
        },
      ]);
      return false;
    }

    await Promise.all([
      this.clientsService.upsertClient({
        contactNumber: remoteJid,
        identification: identification.trim(),
      }),
      this.chatsService.sendResponse([
        {
          remoteJid,
          text: TEXTS.dateOfBirth,
        },
      ]),
    ]);

    return true;
  }
}
