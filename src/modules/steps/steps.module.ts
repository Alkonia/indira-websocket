import { Module } from '@nestjs/common';
import { StepsService } from './steps.service';
import { PatientsModule } from '../patients/patients.module';
import { StepFactory } from './step.factory';
import { FirstContactStep } from './steps/first-contact.step';
import { AcceptTermsStep } from './steps/accept-terms.step';
import { ChatsModule } from '../chats/chats.module';

@Module({
  imports: [PatientsModule, ChatsModule],
  providers: [StepsService, StepFactory, FirstContactStep, AcceptTermsStep],
  exports: [StepsService],
})
export class StepsModule {}
