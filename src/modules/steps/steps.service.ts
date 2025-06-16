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
    if (!client || client.rejectAcceptTerms) {
      return 1;
    }
    if (client && !client.acceptTerms) {
      return 2;
    }
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
