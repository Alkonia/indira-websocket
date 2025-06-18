import { Injectable } from '@nestjs/common';
import { FirstContactStep } from './first-contact.step';
import { AcceptTermsStep } from './accept-terms.step';
import { StepBase } from './step.base';
import { NameStep } from './name.step';
import { IdentificationStep } from './identification.step';
import { IdentificationTypeStep } from './identification-type.step';
import { DateOfBirthStep } from './date-of-birth.step';

@Injectable()
export class StepFactory {
  constructor(
    private readonly firstContactStep: FirstContactStep,
    private readonly acceptTermsStep: AcceptTermsStep,
    private readonly nameStep: NameStep,
    private readonly identificationStep: IdentificationStep,
    private readonly identificationTypeStep: IdentificationTypeStep,
    private readonly dateOfBirthStep: DateOfBirthStep,
  ) {}

  getStep(stepNumber: number): StepBase | null {
    switch (stepNumber) {
      case 1:
        return this.firstContactStep;
      case 2:
        return this.acceptTermsStep;
      case 3:
        return this.nameStep;
      case 4:
        return this.identificationTypeStep;
      case 5:
        return this.identificationStep;
      case 6:
        return this.dateOfBirthStep;
      default:
        return null;
    }
  }
}
