import { Module, forwardRef } from '@nestjs/common';
import { StepsService } from './steps.service';
import { ClientsModule } from '../clients/clients.module';
import { ChatsModule } from '../chats/chats.module';
import { StepFactory } from './steps/step.factory';
import { FirstContactStep } from './steps/first-contact.step';
import { AcceptTermsStep } from './steps/accept-terms.step';
import { NameStep } from './steps/name.step';
import { StepBase } from './steps/step.base';

@Module({
  imports: [ClientsModule, forwardRef(() => ChatsModule)],
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
