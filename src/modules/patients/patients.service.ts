import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, IPatient } from '../../models/patient.schema';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
  ) {}

  /**
   * Get all patients
   * @returns Promise with array of patients
   */
  async getAllPatients(): Promise<IPatient[]> {
    return await this.patientModel.find().exec();
  }

  /**
   * Get patient by ID
   * @param id Patient ID
   * @returns Promise with patient or null if not found
   */
  async getPatientById(id: string): Promise<IPatient | null> {
    return await this.patientModel.findById(id).exec();
  }

  /**
   * Get patient by identification number
   * @param identification Patient identification number
   * @returns Promise with patient or null if not found
   */
  async getPatientByIdentification(
    identification: string,
  ): Promise<IPatient | null> {
    return await this.patientModel.findOne({ identification }).exec();
  }

  /**
   * Get patient by contact number
   * @param contactNumber Patient contact number
   * @returns Promise with patient or null if not found
   */
  async getPatientByContactNumber(
    contactNumber: string,
  ): Promise<IPatient | null> {
    return await this.patientModel.findOne({ contactNumber }).exec();
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

    const existingPatient = await this.patientModel
      .findOne({ contactNumber: patientData.contactNumber })
      .exec();

    if (existingPatient) {
      const updatedPatient = await this.patientModel
        .findByIdAndUpdate(existingPatient._id, patientData, { new: true })
        .exec();

      if (!updatedPatient) {
        throw new Error('Error al actualizar paciente');
      }
      return updatedPatient;
    }

    const newPatient = new this.patientModel(patientData);
    return await newPatient.save();
  }

  /**
   * Update a patient
   * @param id Patient ID
   * @param patientData Patient data to update
   * @returns Promise with updated patient or null if not found
   */
  async updatePatient(
    id: string,
    patientData: Partial<IPatient>,
  ): Promise<IPatient | null> {
    // If identification is being updated, check if it conflicts with another patient
    if (patientData.identification) {
      const existingPatient = await this.patientModel
        .findOne({ identification: patientData.identification })
        .exec();

      if (
        existingPatient &&
        existingPatient._id &&
        String(existingPatient._id) !== id
      ) {
        throw new Error(
          'Another patient with this identification already exists',
        );
      }
    }

    return await this.patientModel
      .findByIdAndUpdate(id, patientData, { new: true })
      .exec();
  }

  /**
   * Delete a patient
   * @param id Patient ID
   * @returns Promise with boolean indicating success
   */
  async deletePatient(id: string): Promise<boolean> {
    const result = await this.patientModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
