import { TMessageUpsert } from '../intefaces/baileys.interface';
import { TStepper } from '../intefaces/message.interface';
import { IPatient } from '../models/patients.model';
import { getStep } from '../utils/getStep.util';
import { PatientService } from './patient.service';

export class StepsService {
  private patientService: PatientService;

  constructor() {
    this.patientService = new PatientService();
  }

  private getStep(patient: IPatient | null) {
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
      message.key.remoteJid
    );
    return {
      step: this.getStep(patient),
      patient,
    };
  }

  private async executeStep(event: TMessageUpsert, stepInfo: TStepper) {
    const step = getStep(stepInfo.step);
    if (!step) return;
    await step.main(event, stepInfo);
  }

  async main(event: TMessageUpsert) {
    const stepInfo = await this.getStepInfo(event);
    await this.executeStep(event, stepInfo);
  }
}
