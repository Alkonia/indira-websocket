import { TEXTS } from '../../constants/texts';
import { TMessageUpsert } from '../../intefaces/baileys.interface';
import { IStepContract } from '../../intefaces/stepsContract.interface';
import { ChatsService } from '../../services/chats.service';
import { PatientService } from '../../services/patient.service';

export class AcceptTerms implements IStepContract {
  private readonly patientService: PatientService;
  constructor() {
    this.patientService = new PatientService();
  }

  async main(event: TMessageUpsert): Promise<boolean> {
    const [message] = event.messages;
    const text =
      message.message?.conversation ||
      message.message?.extendedTextMessage?.text;
    if (!message.key.remoteJid || !text) {
      throw new Error('Se esperaba remoteJid');
    }
    if (
      text.toLowerCase().replaceAll(' ', '') !== '1'
    ) {
      await Promise.all([
        this.patientService.upsertPatient({
          contactNumber: message.key.remoteJid,
          rejectAcceptTerms: true,
        }),
        ChatsService.sendResponse([
          {
            remoteJid: message.key.remoteJid,
            text: TEXTS.reject,
          },
        ]),
      ]);
      return true;
    }
    await Promise.all([
      this.patientService.upsertPatient({
        contactNumber: message.key.remoteJid,
        acceptTerms: true,
        acceptTermsDate: new Date(),
        rejectAcceptTerms: false,
      }),
      ChatsService.sendResponse([
        {
          remoteJid: message.key.remoteJid,
          text: TEXTS.acceptedTerms,
        },
      ]),
    ]);
    return true;
  }
}
