import { Injectable } from '@nestjs/common';
import { TMessageUpsert } from '../../interfaces/baileys.interface';
import { TStepper } from '../../interfaces/message.interface';
import { IPatient } from '../../models/patient.schema';
import { PatientsService } from '../patients/patients.service';
import { StepFactory } from './steps/step.factory';

@Injectable()
export class StepsService {
  constructor(
    private readonly patientService: PatientsService,
    private readonly stepFactory: StepFactory,
  ) {}

  private getStep(patient: IPatient | null): number {
    if (!patient || patient.rejectAcceptTerms) {
      return 1;
    }
    if (patient && !patient.acceptTerms) {
      return 2;
    }
    return 0;
  }

  private async getStepInfo({ messages }: TMessageUpsert): Promise<TStepper> {
    const [message] = messages;
    if (!message.key.remoteJid) {
      throw new Error('Se esperaba remoteJid');
    }
    const patient = await this.patientService.getPatientByContactNumber(
      message.key.remoteJid,
    );
    return {
      step: this.getStep(patient),
      patient,
    };
  }

  private async executeStep(event: TMessageUpsert, stepInfo: TStepper) {
    const step = this.stepFactory.getStep(stepInfo.step);
    if (!step) return;
    await step.main(event);
  }

  async processMessage(event: TMessageUpsert) {
    const stepInfo = await this.getStepInfo(event);
    await this.executeStep(event, stepInfo);
  }
}
