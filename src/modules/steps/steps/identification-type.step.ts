import { Injectable } from '@nestjs/common';
import { TEXTS } from '../../../constants/texts';
import { TMessageUpsert } from '../../../interfaces/baileys.interface';
import { StepBase } from './step.base';

@Injectable()
export class IdentificationTypeStep extends StepBase {
  async main(event: TMessageUpsert): Promise<boolean> {
    const { remoteJid, text } = this.processMessage(event);

    let identificationType = '';

    switch (text) {
      case '1':
        identificationType = 'Cédula de Ciudadanía';
        break;
      case '2':
        identificationType = 'Tarjeta de Identidad';
        break;
      case '3':
        identificationType = 'Cédula de Extranjería';
        break;
      case '4':
        identificationType = 'Pasaporte';
        break;
      default:
        await this.chatsService.sendResponse([
          {
            remoteJid,
            text: TEXTS.invalidIdentificationType,
          },
        ]);
        return false;
    }
    await Promise.all([
      this.clientsService.upsertClient({
        contactNumber: remoteJid,
        identificationType,
      }),
      this.chatsService.sendResponse([
        {
          remoteJid,
          text: TEXTS.identificationType,
        },
      ]),
    ]);

    return true;
  }
}
