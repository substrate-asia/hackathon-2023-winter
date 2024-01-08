import { checkSession, getSessionValues } from '@/app/actions/sporran';
import { getExtensions } from '@kiltprotocol/kilt-extension-api';

export async function getSession(provider: any) {
  // Find all injected extensions
  const extensions = getExtensions();

  // Choose an extension to interact with:
  //  let extension = extensions.find((ext) => ext.name === nameOfSelectedExtension)

  if (provider === undefined) {
    provider = extensions.find(ext => ext !== undefined);
  }
  if (provider === undefined) {
    throw new Error(
      'No KILT-Protocol-supportive extension was found. Can not login. \n Try installing Sporran first. '
    );
  }

  console.log({ provider });

  const response = await getSessionValues();
  const { dAppEncryptionKeyUri, challenge, sessionId } = response.data;
  const dAppName = 'CertifiedProof';

  console.log({ dAppEncryptionKeyUri });
  console.log({ challenge });
  console.log({ sessionId });

  const session = await provider.startSession(dAppName, dAppEncryptionKeyUri, challenge);

  const { encryptionKeyUri, encryptedChallenge, nonce } = session;
  await checkSession(
    {
      encryptionKeyUri,
      encryptedChallenge,
      nonce
    },
    sessionId
  );

  const { name } = provider;

  return { ...session, sessionId, name };
}
