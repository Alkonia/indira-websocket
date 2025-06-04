import { AcceptTerms } from '../class/steps/acceptTerms';
import { FirstContact } from '../class/steps/firstContact';
import { IStepContract } from '../intefaces/stepsContract.interface';

const stepsSet = new Map<number, IStepContract>();
stepsSet.set(1, new FirstContact());
stepsSet.set(2, new AcceptTerms());

export const getStep = (step: number) => {
  const stepContract = stepsSet.get(step);
  if (!stepContract) {
    return undefined;
  }
  return stepContract;
};
