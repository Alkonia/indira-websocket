import { Injectable } from '@nestjs/common';
import { FirstContactStep } from './steps/first-contact.step';
import { AcceptTermsStep } from './steps/accept-terms.step';
import { StepBase } from './step.base';

@Injectable()
export class StepFactory {
  constructor(
    private readonly firstContactStep: FirstContactStep,
    private readonly acceptTermsStep: AcceptTermsStep,
  ) {}

  getStep(stepNumber: number): StepBase | null {
    switch (stepNumber) {
      case 1:
        return this.firstContactStep;
      case 2:
        return this.acceptTermsStep;
      default:
        return null;
    }
  }
}
