// import client from '@/lib/client';
import client from '@/lib/client';
import { Did, DidResourceUri, Utils } from '@kiltprotocol/sdk-js';

export interface CheckSessionInput {
  encryptionKeyUri: DidResourceUri;
  encryptedChallenge: string;
  nonce: string;
}

export interface GetSessionOutput {
  dAppEncryptionKeyUri: DidResourceUri;
  sessionId: string;
  challenge: string;
}

export const sessionHeader = 'x-session-id';

export const getSessionValues = (): Promise<GetSessionOutput> => {
  return client.get(`/session`);
};

export const checkSession = (json: CheckSessionInput, sessionId: string) => {
  const headers = { [sessionHeader]: sessionId };
  return client.post(`/session`, json, { headers });
};
