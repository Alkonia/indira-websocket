import { Injectable } from '@nestjs/common';
import { TEXTS } from '../../../constants/texts';
import { TMessageUpsert } from '../../../interfaces/baileys.interface';
import { StepBase } from './step.base';
import { extractText } from '../../../utils/message.util';

@Injectable()
export class DateOfBirthStep extends StepBase {
  async main(event: TMessageUpsert): Promise<boolean> {
    const { remoteJid } = this.processMessage(event);
    const [message] = event.messages;
    const dateText = extractText(message) || '';

    // Validar formato DD/MM/AAAA
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = dateText.match(dateRegex);

    if (!match) {
      await this.chatsService.sendResponse([
        {
          remoteJid,
          text: TEXTS.invalidDateFormat,
        },
      ]);
      return false;
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // Los meses en JavaScript van de 0 a 11
    const year = parseInt(match[3], 10);

    // Validar que la fecha sea válida
    const date = new Date(year, month, day);
    if (
      date.getDate() !== day ||
      date.getMonth() !== month ||
      date.getFullYear() !== year ||
      date > new Date() // No permitir fechas futuras
    ) {
      await this.chatsService.sendResponse([
        {
          remoteJid,
          text: TEXTS.invalidDate,
        },
      ]);
      return false;
    }

    await Promise.all([
      this.clientsService.upsertClient({
        contactNumber: remoteJid,
        dateOfBirth: date,
        finishBasicData: true,
      }),
      this.chatsService.sendResponse([
        {
          remoteJid,
          text: TEXTS.registrationComplete,
        },
      ]),
    ]);

    return true;
  }
}
