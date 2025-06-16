import { Injectable } from '@nestjs/common';
import { TEXTS } from '../../../constants/texts';
import { TMessageUpsert } from '../../../interfaces/baileys.interface';
import { StepBase } from './step.base';

@Injectable()
export class AcceptTermsStep extends StepBase {
  async main(event: TMessageUpsert): Promise<boolean> {
    const { remoteJid, text } = this.processMessage(event);
    if (text !== '1') {
      await Promise.all([
        this.patientsService.upsertPatient({
          contactNumber: remoteJid,
          rejectAcceptTerms: true,
        }),
        this.chatsService.sendResponse([
          {
            remoteJid,
            text: TEXTS.reject,
          },
        ]),
      ]);
      return true;
    }

    await Promise.all([
      this.patientsService.upsertPatient({
        contactNumber: remoteJid,
        acceptTerms: true,
        acceptTermsDate: new Date(),
        rejectAcceptTerms: false,
      }),
      this.chatsService.sendResponse([
        {
          remoteJid,
          text: TEXTS.acceptedTerms,
        },
      ]),
    ]);

    return true;
  }
}
