import { IPatient } from '../models/patient.schema';

export interface TStepper {
  step: number;
  patient: IPatient | null;
}
