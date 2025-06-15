import { Injectable } from '@nestjs/common';
import { FirstContactStep } from './steps/first-contact.step';
import { AcceptTermsStep } from './steps/accept-terms.step';
import { StepBase } from './step.base';
import { NameStep } from './steps/name.step';

@Injectable()
export class StepFactory {
  constructor(
    private readonly firstContactStep: FirstContactStep,
    private readonly acceptTermsStep: AcceptTermsStep,
    private readonly nameStep: NameStep,
  ) {}

  getStep(stepNumber: number): StepBase | null {
    switch (stepNumber) {
      case 1:
        return this.firstContactStep;
      case 2:
        return this.acceptTermsStep;
      case 3:
        return this.nameStep;
      default:
        return null;
    }
  }
}
