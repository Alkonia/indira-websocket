import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from '../../models/patient.schema';
import { PatientsService } from './patients.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
  ],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
