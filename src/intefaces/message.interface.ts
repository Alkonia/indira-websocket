import { IPatient } from '../models/patients.model';

export type TStepper = {
  step: number;
  patient: IPatient | null;
};

export type TMessageSend = {
  remoteJid: string;
  text: string;
};
