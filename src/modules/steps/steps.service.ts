import { Injectable } from '@nestjs/common';
import { TMessageUpsert } from '../../interfaces/baileys.interface';
import { TStepper } from '../../interfaces/message.interface';
import { IClient } from '../../models/client.schema';
import { ClientsService } from '../clients/clients.service';
import { StepFactory } from './steps/step.factory';

@Injectable()
export class StepsService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly stepFactory: StepFactory,
  ) {}

  async processMessage(event: TMessageUpsert) {
    const stepInfo = await this.getStepInfo(event);
    await this.executeStep(event, stepInfo);
  }

  private getStep(client: IClient | null): number {
    // Si no hay cliente o rechazó los términos, mostrar primer contacto
    if (!client || client.rejectAcceptTerms) {
      return 1;
    }
    // Si no ha aceptado los términos, mostrar step de aceptación
    if (!client.acceptTerms) {
      return 2;
    }

    // Si no tiene nombre, mostrar step de nombre
    if (!client.name) {
      return 3;
    }

    // Si no tiene tipo de identificación, mostrar step de tipo de identificación
    if (!client.identificationType) {
      return 4;
    }

    // Si no tiene identificación, mostrar step de identificación
    if (!client.identification) {
      return 5;
    }

    // Si no tiene fecha de nacimiento, mostrar step de fecha de nacimiento
    if (!client.dateOfBirth) {
      return 6;
    }

    // Si ya completó todos los datos básicos, no hay más steps
    return 0;
  }

  private async getStepInfo({ messages }: TMessageUpsert): Promise<TStepper> {
    const [message] = messages;
    if (!message.key.remoteJid) {
      throw new Error('Se esperaba remoteJid');
    }
    const client = await this.clientsService.getClientByContactNumber(
      message.key.remoteJid,
    );
    return {
      step: this.getStep(client),
      client,
    };
  }

  private async executeStep(event: TMessageUpsert, stepInfo: TStepper) {
    const step = this.stepFactory.getStep(stepInfo.step);
    if (!step) return;
    await step.main(event);
  }
}
