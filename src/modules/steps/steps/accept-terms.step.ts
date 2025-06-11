import { Injectable } from '@nestjs/common';
import { TEXTS } from '../../../constants/texts';
import { TMessageUpsert } from '../../../interfaces/baileys.interface';
import { ChatsService } from '../../chats/chats.service';
import { PatientsService } from '../../patients/patients.service';
import { StepBase } from '../step.base';

@Injectable()
export class AcceptTermsStep extends StepBase {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly chatsService: ChatsService,
  ) {
    super();
  }

  async main(event: TMessageUpsert): Promise<boolean> {
    const [message] = event.messages;
    const text =
      message.message?.conversation ||
      message.message?.extendedTextMessage?.text;

    if (!message.key?.remoteJid || !text) {
      throw new Error('Se esperaba remoteJid o texto');
    }

    const remoteJid = message.key.remoteJid;
    const normalizedText = text.toLowerCase().replaceAll(' ', '');

    if (normalizedText !== '1') {
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
