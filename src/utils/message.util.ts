import { WAMessage } from 'baileys';

export const extractText = (message: WAMessage) => {
  const text =
    message.message?.conversation || message.message?.extendedTextMessage?.text;

  return text;
};
