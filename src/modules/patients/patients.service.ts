import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, IPatient } from '../../models/patient.schema';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
  ) {}

  async getAllPatients(): Promise<IPatient[]> {
    return await this.patientModel.find().exec();
  }

  async getPatientById(id: string): Promise<IPatient | null> {
    return await this.patientModel.findById(id).exec();
  }

  async getPatientByIdentification(
    identification: string,
  ): Promise<IPatient | null> {
    return await this.patientModel.findOne({ identification }).exec();
  }

  async getPatientByContactNumber(
    contactNumber: string,
  ): Promise<IPatient | null> {
    return await this.patientModel.findOne({ contactNumber }).exec();
  }

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

  async updatePatient(
    id: string,
    patientData: Partial<IPatient>,
  ): Promise<IPatient | null> {
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

  async deletePatient(id: string): Promise<boolean> {
    const result = await this.patientModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
