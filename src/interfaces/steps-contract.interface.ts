import { TMessageUpsert } from './baileys.interface';

export interface IStepContract {
  main(event: TMessageUpsert): Promise<boolean>;
}
