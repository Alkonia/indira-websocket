import { BaseRepository } from './base.repository';
import Patient, { IPatient } from '../models/patients.model';

/**
 * Repository for Patient model operations
 */
export class PatientRepository extends BaseRepository<IPatient> {
  constructor() {
    super(Patient);
  }

  /**
   * Find a patient by identification number
   * @param identification Patient identification number
   * @returns Promise with patient or null if not found
   */
  async findByIdentification(identification: string): Promise<IPatient | null> {
    return (await this.model
      .findOne({ identification })
      .lean()) as unknown as IPatient | null;
  }

  /**
   * Find a patient by contact number
   * @param contactNumber Patient contact number
   * @returns Promise with patient or null if not found
   */
  async findByContactNumber(contactNumber: string): Promise<IPatient | null> {
    return (await this.model
      .findOne({ contactNumber })
      .lean()) as unknown as IPatient | null;
  }
}
