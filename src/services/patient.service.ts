import { PatientRepository } from '../repositories/patient.repository';
import { IPatient } from '../models/patients.model';

/**
 * Service for patient-related business logic
 */
export class PatientService {
  private patientRepository: PatientRepository;

  constructor() {
    this.patientRepository = new PatientRepository();
  }

  /**
   * Get all patients
   * @returns Promise with array of patients
   */
  async getAllPatients(): Promise<IPatient[]> {
    return await this.patientRepository.findAll();
  }

  /**
   * Get patient by ID
   * @param id Patient ID
   * @returns Promise with patient or null if not found
   */
  async getPatientById(id: string): Promise<IPatient | null> {
    return await this.patientRepository.findById(id);
  }

  /**
   * Get patient by identification number
   * @param identification Patient identification number
   * @returns Promise with patient or null if not found
   */
  async getPatientByIdentification(
    identification: string
  ): Promise<IPatient | null> {
    return await this.patientRepository.findByIdentification(identification);
  }

  /**
   * Get patient by contact number
   * @param contactNumber Patient contact number
   * @returns Promise with patient or null if not found
   */
  async getPatientByContactNumber(
    contactNumber: string
  ): Promise<IPatient | null> {
    return await this.patientRepository.findByContactNumber(contactNumber);
  }

  /**
   * Upsert a patient
   * @param patientData Patient data
   * @returns Promise with created patient
   */
  async upsertPatient(patientData: Partial<IPatient>): Promise<IPatient> {
    if (!patientData.contactNumber) {
      throw new Error('Se esperaba contactNumber');
    }
    const existingPatient = await this.patientRepository.findByContactNumber(
      patientData.contactNumber
    );
    if (existingPatient) {
      const patient = await this.patientRepository.update(existingPatient._id, {
        ...patientData,
      });
      if (!patient) {
        throw new Error('Error al actualizar paciente');
      }
      return patient;
    }
    return await this.patientRepository.create({
      ...patientData,
    });
  }

  /**
   * Update a patient
   * @param id Patient ID
   * @param patientData Patient data to update
   * @returns Promise with updated patient or null if not found
   */
  async updatePatient(
    id: string,
    patientData: Partial<IPatient>
  ): Promise<IPatient | null> {
    // If identification is being updated, check if it conflicts with another patient
    if (patientData.identification) {
      const existingPatient = await this.patientRepository.findByIdentification(
        patientData.identification
      );
      if (existingPatient && existingPatient._id.toString() !== id) {
        throw new Error(
          'Another patient with this identification already exists'
        );
      }
    }

    return await this.patientRepository.update(id, patientData);
  }

  /**
   * Delete a patient
   * @param id Patient ID
   * @returns Promise with boolean indicating success
   */
  async deletePatient(id: string): Promise<boolean> {
    return await this.patientRepository.delete(id);
  }
}
