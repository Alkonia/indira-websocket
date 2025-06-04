import { Schema, model } from 'mongoose';

// Define the interface for the Patient document
export interface IPatient {
  _id: string;
  name: string;
  identification: string;
  dateOfBirth: Date;
  identificationType: string;
  contactNumber: string;
  finishBasicData: boolean;
  acceptTerms: boolean;
  rejectAcceptTerms: boolean;
  acceptTermsDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Patient schema
const patientSchema = new Schema<IPatient>(
  {
    name: {
      type: String,
      trim: true,
    },
    identification: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    identificationType: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: String,
      trim: true,
      required: true,
      index: true,
      unique: true,
    },
    finishBasicData: {
      type: Boolean,
      default: false,
    },
    acceptTerms: {
      type: Boolean,
      default: false,
    },
    rejectAcceptTerms: {
      type: Boolean,
      default: false,
    },
    acceptTermsDate: {
      type: Date,
    },
  },
  {
    _id: true,
    timestamps: true,
    versionKey: false,
  }
);

const Patient = model<IPatient>('patients', patientSchema);
export default Patient;
