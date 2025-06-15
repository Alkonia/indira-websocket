import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { TMessageUpsert } from 'src/interfaces/baileys.interface';
import { IStepContract } from '../../interfaces/steps-contract.interface';
import { ChatsService } from '../chats/chats.service';
import { PatientsService } from '../patients/patients.service';

@Injectable()
export class StepBase implements IStepContract {
  constructor(
    protected readonly patientsService: PatientsService,
    @Inject(forwardRef(() => ChatsService))
    protected readonly chatsService: ChatsService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  main(event: TMessageUpsert): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
