import { Module, forwardRef } from '@nestjs/common';
import { StepsService } from './steps.service';
import { ClientsModule } from '../clients/clients.module';
import { ChatsModule } from '../chats/chats.module';
import { StepFactory } from './steps/step.factory';
import { FirstContactStep } from './steps/first-contact.step';
import { AcceptTermsStep } from './steps/accept-terms.step';
import { NameStep } from './steps/name.step';
import { StepBase } from './steps/step.base';
import { IdentificationStep } from './steps/identification.step';
import { IdentificationTypeStep } from './steps/identification-type.step';
import { DateOfBirthStep } from './steps/date-of-birth.step';

@Module({
  imports: [ClientsModule, forwardRef(() => ChatsModule)],
  providers: [
    StepBase,
    StepsService,
    StepFactory,
    FirstContactStep,
    AcceptTermsStep,
    NameStep,
    IdentificationStep,
    IdentificationTypeStep,
    DateOfBirthStep,
  ],
  exports: [StepsService],
})
export class StepsModule {}
