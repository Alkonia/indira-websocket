import { TEXTS } from '../../constants/texts';
import { TMessageUpsert } from '../../intefaces/baileys.interface';
import { IStepContract } from '../../intefaces/stepsContract.interface';
import { ChatsService } from '../../services/chats.service';
import { PatientService } from '../../services/patient.service';

export class FirstContact implements IStepContract {
  private readonly patientService: PatientService;
  constructor() {
    this.patientService = new PatientService();
  }

  async main(event: TMessageUpsert): Promise<boolean> {
    const [message] = event.messages;
    if (!message.key.remoteJid) {
      throw new Error('Se esperaba remoteJid');
    }
    await Promise.all([
      this.patientService.upsertPatient({
        contactNumber: message.key.remoteJid,
        rejectAcceptTerms: false,
      }),
      ChatsService.sendResponse([
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
