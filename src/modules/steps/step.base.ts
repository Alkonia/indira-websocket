import { TMessageUpsert } from '../../interfaces/baileys.interface';
import { IStepContract } from '../../interfaces/steps-contract.interface';

export abstract class StepBase implements IStepContract {
  abstract main(event: TMessageUpsert): Promise<boolean>;
}
