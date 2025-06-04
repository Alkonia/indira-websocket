import makeWASocket, { MessageUpsertType, WAMessage } from 'baileys';

export type TMessageUpsert = {
  messages: WAMessage[];
  type: MessageUpsertType;
  requestId?: string;
};

export type TWASocket = ReturnType<typeof makeWASocket>;
