import { TMessageUpsert } from './baileys.interface';
import { TStepper } from './message.interface';

export interface IStepContract {
  main(event: TMessageUpsert, stepInfo: TStepper): Promise<boolean>;
}
