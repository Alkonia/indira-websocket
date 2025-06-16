import { IClient } from '../models/client.schema';

export interface TStepper {
  step: number;
  client: IClient | null;
}
