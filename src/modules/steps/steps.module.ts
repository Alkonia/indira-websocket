import { Module, forwardRef } from '@nestjs/common';
import { StepsService } from './steps.service';
import { PatientsModule } from '../patients/patients.module';
import { ChatsModule } from '../chats/chats.module';
import { StepFactory } from './step.factory';
import { FirstContactStep } from './steps/first-contact.step';
import { AcceptTermsStep } from './steps/accept-terms.step';
import { NameStep } from './steps/name.step';
import { StepBase } from './step.base';

@Module({
  imports: [PatientsModule, forwardRef(() => ChatsModule)],
  providers: [
    StepBase,
    StepsService,
    StepFactory,
    FirstContactStep,
    AcceptTermsStep,
    NameStep,
  ],
  exports: [StepsService],
})
export class StepsModule {}
